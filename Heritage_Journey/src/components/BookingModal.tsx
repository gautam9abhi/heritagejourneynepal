import { X, Users, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzlkqbp';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    currentCountry: '',
    destination: '',
    otherDestination: '',
    tripType: '',
    departureDate: '',
    returnDate: '',
    duration: '',
    travelers: '2',
    adults: '2',
    children: '0',
    childrenAges: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setFormData({
            fullName: '', email: '', phone: '', nationality: '', currentCountry: '',
            destination: '', otherDestination: '', tripType: '', departureDate: '',
            returnDate: '', duration: '', travelers: '2', adults: '2', children: '0',
            childrenAges: '', message: ''
          });
        }, 2200);
      } else {
        alert('Failed to send. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl"
          >
            <div className="sticky top-0 bg-white border-b p-6 z-10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Start Your Nepal Journey</h2>
                <p className="text-sm text-gray-600">Please fill in your details</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-10 overflow-auto max-h-[calc(95vh-85px)]">
              
              {/* Personal Details */}
              <div>
                <h3 className="font-semibold text-xl mb-5 flex items-center gap-2">
                  <Users className="h-6 w-6 text-orange-600" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
                    <input type="text" name="nationality" required value={formData.nationality} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:border-orange-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Country of Residence *</label>
                    <input type="text" name="currentCountry" required value={formData.currentCountry} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:border-orange-500" />
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div>
                <h3 className="font-semibold text-xl mb-5 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-orange-600" /> Travel Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interested Destination</label>
                    <select name="destination" value={formData.destination} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl">
                      <option value="">Select Destination</option>
                      <option value="Kathmandu Valley">Kathmandu Valley</option>
                      <option value="Pokhara & Annapurna">Pokhara & Annapurna</option>
                      <option value="Everest Region">Everest Region</option>
                      <option value="Chitwan National Park">Chitwan National Park</option>
                      <option value="Langtang">Langtang Valley</option>
                      <option value="Multi-Destination">Multi-Destination Tour</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {formData.destination === 'Other' && (
                    <input type="text" name="otherDestination" placeholder="Please specify" value={formData.otherDestination} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl" />
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type of Travel</label>
                    <select name="tripType" value={formData.tripType} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl">
                      <option value="">Select Trip Type</option>
                      <option value="Cultural Heritage">Cultural & Heritage Tour</option>
                      <option value="Adventure Trekking">Adventure Trekking</option>
                      <option value="Wildlife Safari">Wildlife Safari</option>
                      <option value="Luxury Tour">Luxury Tour</option>
                      <option value="Honeymoon">Honeymoon / Romantic</option>
                      <option value="Family Tour">Family Tour</option>
                      <option value="Custom">Custom Itinerary</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                      <input type="date" name="departureDate" value={formData.departureDate} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                      <input type="date" name="returnDate" value={formData.returnDate} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trip Duration (Days)</label>
                    <input type="text" name="duration" placeholder="e.g. 12 Days, 2 Weeks" value={formData.duration} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Travelers</label>
                      <select name="travelers" value={formData.travelers} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl">
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                      <input type="number" name="adults" min="1" value={formData.adults} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                      <input type="number" name="children" min="0" value={formData.children} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-2xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests / Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any additional information, interests, dietary requirements, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:border-orange-500 resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-4 rounded-2xl font-semibold text-lg transition-all"
              >
                {isSubmitting ? 'Sending...' : submitted ? '✓ Request Sent Successfully!' : 'Submit Booking Inquiry'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;