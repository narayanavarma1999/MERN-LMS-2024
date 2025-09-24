import { useState } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    MessageCircle,
    CheckCircle2,
    ExternalLink
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    const contactMethods = [
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Email Us",
            description: "Send us an email anytime",
            details: "support@virtilearn.com",
            link: "mailto:support@virtilearn.com",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <Phone className="h-6 w-6" />,
            title: "Call Us",
            description: "Mon to Fri from 9am to 6pm",
            details: "+1 (555) 123-4567",
            link: "tel:+15551234567",
            color: "from-green-500 to-green-600"
        },
        {
            icon: <MessageCircle className="h-6 w-6" />,
            title: "Live Chat",
            description: "Instant support via chat",
            details: "Start chatting now",
            link: "#chat",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: <MapPin className="h-6 w-6" />,
            title: "Visit Us",
            description: "Come say hello at our office",
            details: "123 Education St, Learning City",
            link: "https://maps.google.com",
            color: "from-orange-500 to-orange-600"
        }
    ];

    const faqItems = [
        {
            question: "How can I reset my password?",
            answer: "Go to the login page and click 'Forgot Password'. You'll receive an email with reset instructions."
        },
        {
            question: "Do you offer technical support for courses?",
            answer: "Yes, we provide comprehensive technical support for all course-related issues through our help desk."
        },
        {
            question: "Can I download courses for offline viewing?",
            answer: "Yes, most courses offer downloadable materials and some support offline viewing through our mobile app."
        },
        {
            question: "What's your refund policy?",
            answer: "We offer a 30-day money-back guarantee if you're not satisfied with your course."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 bg-gradient-to-r from-blue-50 to-indigo-50 py-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We're here to help you succeed in your learning journey. Reach out to us with any questions or concerns.
                    </p>
                </div>

                {/* Contact Methods Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactMethods.map((method, index) => (
                        <a
                            key={index}
                            href={method.link}
                            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${method.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                                {method.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{method.description}</p>
                            <div className="flex items-center text-blue-600 font-medium">
                                <span className="text-sm">{method.details}</span>
                                <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </a>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                <Send className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 ml-3">Send us a Message</h2>
                        </div>

                        {isSubmitted && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                                <span className="text-green-800 font-medium">Thank you! Your message has been sent successfully.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* FAQ & Additional Info */}
                    <div className="space-y-8">
                        {/* FAQ Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                                        <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                                        <p className="text-gray-600 text-sm">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Office Hours */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center mb-4">
                                <Clock className="h-5 w-5 mr-2" />
                                <h3 className="text-lg font-bold">Office Hours</h3>
                            </div>
                            <div className="space-y-2 font-semibold text-gray-900">
                                <div className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span>9:00 AM - 6:00 PM EST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span>10:00 AM - 4:00 PM EST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span>Closed</span>
                                </div>
                            </div>
                            <p className="mt-4 text-blue-600 text-sm">
                                We typically respond to emails within 2-4 hours during business hours.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Office</h2>
                    <div className="rounded-xl overflow-hidden h-64">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.17759436!2d-74.00594968459413!3d40.71278367933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1e1c2a0a9f%3A0x8b9a0b0b0b0b0b0b!2s123%20Education%20Street%2C%20New%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-xl"
                        ></iframe>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">123 Education Street, Learning City, LC 12345</p>
                        <a
                            href="https://maps.google.com/?q=123+Education+Street+Learning+City+LC+12345"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-2"
                        >
                            <MapPin className="h-4 w-4" />
                            Open in Google Maps
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;