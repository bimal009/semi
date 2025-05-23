export default function Footer() {
    return (
        <footer className="bg-teal-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About LifePatch</h3>
                        <p className="text-teal-100">
                            Connecting organ donors with recipients to save lives through timely and efficient organ matching.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/about" className="text-teal-100 hover:text-white">About Us</a></li>
                            <li><a href="/contact" className="text-teal-100 hover:text-white">Contact</a></li>
                            <li><a href="/privacy" className="text-teal-100 hover:text-white">Privacy Policy</a></li>
                            <li><a href="/terms" className="text-teal-100 hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-teal-100">
                            <li>Email: support@lifepatch.org</li>
                            <li>Phone: +1 (555) 123-4567</li>
                            <li>Address: 123 Health Street, Medical District</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-teal-700 text-center text-teal-100">
                    <p>&copy; {new Date().getFullYear()} LifePatch. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
} 