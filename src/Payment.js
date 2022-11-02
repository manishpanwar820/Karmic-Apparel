import {   CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format'; 
import { Link , useNavigate} from 'react-router-dom';
import App from './App';
import CheckoutProduct from './CheckoutProduct';
import { db } from './firebase';
import './Payment.css';
import { getBasketTotal } from './reducer';
import { useStateValue } from './StateProvider';


function payment() {
    const [{ basket, user}, dispatch] = useStateValue();
    const history = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");

    const [error, setError] = useState(null);
    const [disabled, setDisabled] =useState(true);
    const [clientSecret , setClientSecret] = useState(true);

    useEffect(() => {
       const getClientSecret = async () => {
         const response = await axios({
             method: 'post',
             url: `/payments/create?total=${getBasketTotal(basket) * 100}`
         });
         setClientSecret(response.data.clientSecret)
       }
        getClientSecret();
    },[basket])
    console.log('THE SECRET IS >>>>',clientSecret)
    console.log('👱', user)
    

    const handleSubmit = async(event)=> {
        //do stripe stuff
        event.preventDefault();
        setProcessing(true);
       
         const payload = await stripe.confirmCardPayment(clientSecret, {
             payment_method: {
                 card: elements.getElement(CardElement)
             }
         }).then(({ paymentIntent }) => {

           db
           .collection('users')
           .doc(user.uid)
           .collection('orders')
           .doc(paymentIntent.id)
           .set({
             basket: basket,
             amount: paymentIntent.amount,
             created: paymentIntent.created
           })

           setSucceeded(true);
           setError(null)
           setProcessing(false)

          dispatch({
              type: 'EMPTY_BASKET'
            })

            history.replace('/orders')
         })
    }

    const handleChange = event => {
      // display error
      setDisabled(event.empty);
      setError(event.error ? event.error.message : "");
    }


  return (
    <div className='payment'>
        <div className='payment_container'>
            <h1>
                Checkout(
                    <Link to="/checkout">{basket.length} items</Link>
                    )
            </h1>
            {/**delivery address */}
            <div className='payment_section'>
                <div className='payment_title'>
                    <h3>Delivery Address</h3>

                </div>
            <div className='payment_address'>
                <p>{user.email}</p>
                <p>Sector-13 Dwarka</p>
                <p>New Delhi, India</p>

            </div>
            </div>
            {/**review itmes */}
            <div className='payment_section'>
               <div className='payment_title'>
                   <h3>Review items and Delivery</h3>

               </div>
               <div className='payment_items'>
               {basket.map(item => (
            <CheckoutProduct
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              rating={item.rating}
            />
          ))}
             </div>
            </div>

            {/**payment method */}
            
            <div className='payment_section'>
              <div className="payment_title">
                  <h3>Payment Method</h3>

              </div>
              <div className='payment_details'>
                  {/**stripe mmagic will go here */}
                 <form onSubmit={handleSubmit}>
                     <CardElement onChange={handleChange}/>

                     <div className='payment_priceContainer'>
                     <CurrencyFormat
                      renderText={(value) => (
                      <>
                     <h3>Order Total: {value} </h3>
                     </>
                     )}
                     decimalScale={2}
                     value={getBasketTotal(basket)} 
                     displayType={"text"}
                     thousandSeparator={true}
                     prefix={"₹"}
                     />
                     <button disabled={processing || disabled || succeeded}>
                        <span>{processing ?  <p>processing</p> : "Buy Now"}</span>
                     </button>
                    </div>
                    {/**Errors */}
                    {error && <div>{error}</div>}
                 </form>
              </div>
            </div>

        </div>

    </div>
  )
}

export default payment