import { usePaystackPayment } from 'react-paystack';

export const SubscriptionCheckout = ({ businessId, email, planType }) => {
  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: planType === 'PREMIUM_ANNUAL' ? 12000000 : 5000000, // Amount in kobo
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    metadata: {
      businessId,
      planType,
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    // Payment completed on client, but webhook will do the official DB verification
    alert("Payment successful! Your account status will update shortly.");
  };

  const onClose = () => {
    alert("Payment popup closed.");
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="text-lg font-bold">Annual {planType} Plan</h3>
      <p className="text-gray-600 mb-4">
        {planType === 'PREMIUM_ANNUAL' ? '₦120,000 / year' : '₦50,000 / year'}
      </p>
      <button
        onClick={() => initializePayment(onSuccess, onClose)}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg w-full"
      >
        Pay with Paystack
      </button>
    </div>
  );
};