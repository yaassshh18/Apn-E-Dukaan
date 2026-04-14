import { useParams } from 'react-router-dom';

const Legal = () => {
    const { section } = useParams();

    const renderContent = () => {
        if (section === 'privacy') {
            return (
                <>
                    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                    <p className="mb-4 text-gray-600 leading-relaxed">At Apn-E-Dukaan, we prioritize your privacy. This policy outlines how we collect, use, and protect your personal information on our hyperlocal marketplace. We use your location data solely to connect you with nearby sellers and never sell your data to third parties.</p>
                    <h2 className="text-xl font-bold mt-6 mb-3">Data Collection</h2>
                    <p className="text-gray-600 leading-relaxed">We collect your username, email, phone number, and location (latitude/longitude) to enable hyperlocal commerce and negotiation features.</p>
                </>
            );
        } else if (section === 'refund') {
            return (
                <>
                    <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>
                    <p className="mb-4 text-gray-600 leading-relaxed">Since Apn-E-Dukaan connects you directly with local sellers, refund and cancellation terms are negotiated primarily between the buyer and the seller. However, if you used Razorpay (Online Payment), you have a 24-hour window to raise a dispute for a full refund if the item was not delivered.</p>
                    <ul className="list-disc pl-5 text-gray-600 mt-4 space-y-2">
                        <li>COD orders can be cancelled anytime before shipment.</li>
                        <li>Online orders can be cancelled for an instant refund within 2 hours.</li>
                        <li>Defective products must be reported within 48 hours for a return pickup.</li>
                    </ul>
                </>
            );
        } else {
            return (
                <>
                    <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                    <p className="mb-4 text-gray-600 leading-relaxed">By using Apn-E-Dukaan, you agree to engage in fair, local commerce. You may not list illegal, restricted, or counterfeit products. The platform is merely a facilitator and holds no liability for extreme seller-buyer disputes, though we provide a robust reporting system to ban fraudulent players.</p>
                    <h2 className="text-xl font-bold mt-6 mb-3">Seller Guidelines</h2>
                    <p className="text-gray-600 leading-relaxed">Sellers must honor the negotiated chat prices and fulfill orders in a timely manner. Repeated order cancellations will result in a permanent ban.</p>
                </>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-20 px-6">
            <div className="max-w-4xl mx-auto glass-card p-10 bg-white">
                {renderContent()}
            </div>
        </div>
    );
};

export default Legal;
