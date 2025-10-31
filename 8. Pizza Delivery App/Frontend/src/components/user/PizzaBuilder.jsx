import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Navbar from '../shared/Navbar';

const steps = ['Base', 'Sauce', 'Cheese', 'Veggies', 'Meat'];

const PizzaBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inventory, setInventory] = useState(null);
  const [pizza, setPizza] = useState({
    base: null,
    sauce: null,
    cheese: null,
    veggies: [],
    meat: [],
  });
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await api.get('/inventory/available');
      setInventory(data);
      
      // Create price map
      const priceMap = {};
      [...data.bases, ...data.sauces, ...data.cheeses, ...data.veggies, ...data.meats].forEach(item => {
        priceMap[item.name] = item.price;
      });
      setPrices(priceMap);
    } catch (error) {
      toast.error('Failed to load ingredients');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const stepName = steps[currentStep].toLowerCase();
    
    if (stepName === 'base' && !pizza.base) {
      toast.error('Please select a pizza base');
      return;
    }
    if (stepName === 'sauce' && !pizza.sauce) {
      toast.error('Please select a sauce');
      return;
    }
    if (stepName === 'cheese' && !pizza.cheese) {
      toast.error('Please select a cheese');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelectBase = (base) => {
    setPizza({ ...pizza, base: base.name });
  };

  const handleSelectSauce = (sauce) => {
    setPizza({ ...pizza, sauce: sauce.name });
  };

  const handleSelectCheese = (cheese) => {
    setPizza({ ...pizza, cheese: cheese.name });
  };

  const handleToggleVeggie = (veggie) => {
    const veggies = pizza.veggies.includes(veggie.name)
      ? pizza.veggies.filter(v => v !== veggie.name)
      : [...pizza.veggies, veggie.name];
    setPizza({ ...pizza, veggies });
  };

  const handleToggleMeat = (meat) => {
    const meats = pizza.meat.includes(meat.name)
      ? pizza.meat.filter(m => m !== meat.name)
      : [...pizza.meat, meat.name];
    setPizza({ ...pizza, meat: meats });
  };

  const calculateTotal = () => {
    let total = 0;
    if (pizza.base) total += prices[pizza.base] || 0;
    if (pizza.sauce) total += prices[pizza.sauce] || 0;
    if (pizza.cheese) total += prices[pizza.cheese] || 0;
    pizza.veggies.forEach(v => total += prices[v] || 0);
    pizza.meat.forEach(m => total += prices[m] || 0);
    return total;
  };

  const handleCheckout = () => {
    if (!pizza.base || !pizza.sauce || !pizza.cheese) {
      toast.error('Please complete all required selections');
      return;
    }
    navigate('/checkout', { state: { pizza, totalPrice: calculateTotal() } });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    const stepName = steps[currentStep].toLowerCase();

    switch (stepName) {
      case 'base':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory?.bases?.map((base, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSelectBase(base)}
                className={`pizza-card cursor-pointer ${
                  pizza.base === base.name ? 'ring-4 ring-purple-600' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🍕</div>
                  <h3 className="text-xl font-bold mb-2">{base.name}</h3>
                  <p className="text-gray-600 mb-3">Stock: {base.quantity}</p>
                  <p className="text-2xl font-bold text-purple-600">₹{base.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'sauce':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory?.sauces?.map((sauce, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSelectSauce(sauce)}
                className={`pizza-card cursor-pointer ${
                  pizza.sauce === sauce.name ? 'ring-4 ring-pink-600' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🥫</div>
                  <h3 className="text-xl font-bold mb-2">{sauce.name}</h3>
                  <p className="text-gray-600 mb-3">Stock: {sauce.quantity}</p>
                  <p className="text-2xl font-bold text-pink-600">₹{sauce.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'cheese':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory?.cheeses?.map((cheese, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSelectCheese(cheese)}
                className={`pizza-card cursor-pointer ${
                  pizza.cheese === cheese.name ? 'ring-4 ring-yellow-600' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🧀</div>
                  <h3 className="text-xl font-bold mb-2">{cheese.name}</h3>
                  <p className="text-gray-600 mb-3">Stock: {cheese.quantity}</p>
                  <p className="text-2xl font-bold text-yellow-600">₹{cheese.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'veggies':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory?.veggies?.map((veggie, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleToggleVeggie(veggie)}
                className={`pizza-card cursor-pointer ${
                  pizza.veggies.includes(veggie.name) ? 'ring-4 ring-green-600' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🥗</div>
                  <h3 className="text-xl font-bold mb-2">{veggie.name}</h3>
                  <p className="text-gray-600 mb-3">Stock: {veggie.quantity}</p>
                  <p className="text-2xl font-bold text-green-600">₹{veggie.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'meat':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory?.meats?.map((meat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleToggleMeat(meat)}
                className={`pizza-card cursor-pointer ${
                  pizza.meat.includes(meat.name) ? 'ring-4 ring-red-600' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🍖</div>
                  <h3 className="text-xl font-bold mb-2">{meat.name}</h3>
                  <p className="text-gray-600 mb-3">Stock: {meat.quantity}</p>
                  <p className="text-2xl font-bold text-red-600">₹{meat.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  idx <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                } font-bold`}>
                  {idx + 1}
                </div>
                <div className={`ml-2 ${idx <= currentStep ? 'text-purple-600' : 'text-gray-500'} font-semibold`}>
                  {step}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    idx < currentStep ? 'bg-purple-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Title */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-2">Choose Your {steps[currentStep]}</h2>
          <p className="text-gray-600">
            {currentStep < 3 ? 'Select one option' : 'Select multiple options (optional)'}
          </p>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation and Summary */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="inline-block mr-2 h-5 w-5" />
            Back
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Total Price</p>
            <p className="text-3xl font-bold text-purple-600">₹{calculateTotal()}</p>
          </div>

          {currentStep < steps.length - 1 ? (
            <button onClick={handleNext} className="btn-primary">
              Next
              <ChevronRight className="inline-block ml-2 h-5 w-5" />
            </button>
          ) : (
            <button onClick={handleCheckout} className="btn-primary">
              <ShoppingCart className="inline-block mr-2 h-5 w-5" />
              Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PizzaBuilder;
