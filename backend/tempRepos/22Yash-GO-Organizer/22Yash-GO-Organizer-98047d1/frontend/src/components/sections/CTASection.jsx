import React from 'react';

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500 to-blue-600">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Clean Up Your Code?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands of developers who trust GitHub Organizer to keep their repositories clean</p>
        <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
          Start Your Free Trial
        </button>
        <p className="mt-4 text-sm opacity-75">No credit card required • Setup in 2 minutes</p>
      </div>
    </section>
  );
};

export default CTASection;