import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMusic } from '../../context/MusicContext';
import Button from '../../components/atoms/Button';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, removeFromCart, getTotalPrice, addPurchase } = useMusic();
  const navigate = useNavigate();

  const handleCompletePurchase = () => {
    addPurchase(cart);
    navigate('/payment-success');
  };

  if (cart.length === 0) {
    return (
      <main className="checkout checkout--empty">
        <div className="checkout__panel">
          <p className="checkout__eyebrow">Your cart</p>
          <h1>Your cart is empty</h1>
          <p>Add a beat from the catalog to begin your demo checkout.</p>
          <Link to="/catalog">
            <Button variant="primary" size="lg">Browse Catalog</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout">
      <div className="checkout__header">
        <p className="checkout__eyebrow">Secure demo checkout</p>
        <h1>Review your order</h1>
        <p>Confirm your beats before completing this simulated purchase.</p>
      </div>

      <div className="checkout__layout">
        <section className="checkout__items" aria-label="Items in your cart">
          {cart.map(track => (
            <article className="checkout__item" key={track.id}>
              <div>
                <h2>{track.title}</h2>
                <p>{track.artist} · {track.genre}</p>
              </div>
              <div className="checkout__item-action">
                <strong>${Number(track.price).toFixed(2)}</strong>
                <button type="button" onClick={() => removeFromCart(track.id)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="checkout__summary" aria-label="Order summary">
          <div className="checkout__summary-row">
            <span>Subtotal</span>
            <strong>${getTotalPrice()}</strong>
          </div>
          <div className="checkout__summary-row checkout__summary-row--total">
            <span>Total</span>
            <strong>${getTotalPrice()}</strong>
          </div>
          <Button variant="primary" size="lg" onClick={handleCompletePurchase}>
            Complete Demo Purchase
          </Button>
          <Link className="checkout__back" to="/catalog">Continue shopping</Link>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;