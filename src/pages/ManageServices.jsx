import { useState, useEffect } from 'react';
import { servicesAPI } from '../api';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingService) {
        await servicesAPI.update(editingService.id, data);
        setSuccess('Service updated successfully!');
      } else {
        await servicesAPI.create(data);
        setSuccess('Service created successfully!');
      }
      
      setShowModal(false);
      setEditingService(null);
      setFormData({ name: '', description: '', price: '' });
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await servicesAPI.delete(serviceId);
      setSuccess('Service deleted successfully!');
      fetchServices();
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', price: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', description: '', price: '' });
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
    <div className="manage-services-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">🛠️ Manage Services</h1>
          <p className="page-subtitle">Add, edit, or remove PC maintenance services</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          + Add New Service
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {services.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛠️</div>
          <h3 className="empty-state-title">No Services Yet</h3>
          <p>Add your first service to get started.</p>
          <button onClick={openAddModal} className="btn btn-primary mt-3">
            Add First Service
          </button>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-header">
                <h3 className="service-name">{service.name}</h3>
                <div className="service-price">{formatPrice(service.price)}</div>
              </div>
              <p className="service-description">{service.description}</p>
              <div className="service-actions">
                <button 
                  onClick={() => handleEdit(service)} 
                  className="btn btn-small btn-secondary"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(service.id)} 
                  className="btn btn-small btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={closeModal} className="modal-close">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Service Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g., Virus Removal"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Describe the service..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price (TZS)</label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  placeholder="e.g., 50000"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1000"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
