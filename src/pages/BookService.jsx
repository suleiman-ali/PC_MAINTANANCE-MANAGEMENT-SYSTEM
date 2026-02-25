import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { servicesAPI, bookingsAPI } from '../api';

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    service: '',
    problem_description: '',
    preferred_date: '',
    address: '',
    phone: '',
    payment_method: 'cash',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
      
      if (serviceId) {
        const service = response.data.find(s => s.id === parseInt(serviceId));
        if (service) {
          setSelectedService(service);
          setFormData(prev => ({ ...prev, service: service.id }));
        }
      }
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'service') {
      const service = services.find(s => s.id === parseInt(value));
      setSelectedService(service);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await bookingsAPI.create(formData);
      setSuccess('Booking created successfully!');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="booking-container">
      <div className="booking-form">
        <div className="booking-header">
          <h1>📋 Book a Service</h1>
          <p>Fill in the details below to book a PC maintenance service</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select Service</label>
            <select
              name="service"
              className="form-select"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a Service --</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {formatPrice(service.price)}
                </option>
              ))}
            </select>
          </div>

          {selectedService && (
            <div className="booking-summary">
              <h3>Service Details</h3>
              <div className="booking-summary-item">
                <span>Service Name</span>
                <span>{selectedService.name}</span>
              </div>
              <div className="booking-summary-item">
                <span>Price</span>
                <span>{formatPrice(selectedService.price)}</span>
              </div>
              <div className="booking-summary-item">
                <span>Description</span>
                <span>{selectedService.description}</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Describe the Problem</label>
            <textarea
              name="problem_description"
              className="form-textarea"
              placeholder="Please describe the problem with your PC in detail..."
              value={formData.problem_description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Date</label>
            <input
              type="date"
              name="preferred_date"
              className="form-input"
              value={formData.preferred_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Address</label>
            <textarea
              name="address"
              className="form-textarea"
              placeholder="Enter your full address for service delivery..."
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Enter your phone number..."
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              name="payment_method"
              className="form-select"
              value={formData.payment_method}
              onChange={handleChange}
              required
            >
              <option value="cash">Cash on Delivery</option>
              <option value="card">Card Payment</option>
              <option value="mobile_money">Mobile Money (M-Pesa)</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={submitting || !formData.service}
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
            <Link to="/services" className="btn btn-secondary btn-large">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookService;
