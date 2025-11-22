import React, { useState } from 'react';
import { CHURCH_NAME, CHURCH_ADDRESS, CHURCH_LOGO_URL } from './constants';
import { VisitorFormData, AgeRange, GeneratedContent } from './types';
import { generateWelcomeAndPrayer } from './services/geminiService';
import { InputField } from './components/InputField';
import { Button } from './components/Button';
import { MapPin, Heart, UserPlus, CheckCircle2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  
  const [formData, setFormData] = useState<VisitorFormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    cityStateZip: '',
    ageRange: AgeRange.ADULT,
    prayerRequest: '',
    membershipInterest: 'no',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const content = await generateWelcomeAndPrayer(formData);
      setGeneratedContent(content);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to submit", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      cityStateZip: '',
      ageRange: AgeRange.ADULT,
      prayerRequest: '',
      membershipInterest: 'no',
    });
    setIsSubmitted(false);
    setGeneratedContent(null);
  };

  if (isSubmitted && generatedContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
          <div className="bg-indigo-600 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white mb-4">
              <CheckCircle2 className="h-10 w-10 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-white">Welcome Home!</h2>
            <p className="text-indigo-100 mt-2">Thank you for connecting with us today.</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-indigo-900">A Note for You</h3>
                  <p className="mt-2 text-gray-700 leading-relaxed">{generatedContent.welcomeMessage}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
              <div className="flex items-start space-x-3">
                <Heart className="h-6 w-6 text-rose-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Our Prayer for You</h3>
                  <p className="mt-2 text-gray-700 italic font-medium text-lg">"{generatedContent.prayer}"</p>
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
               <p className="text-sm text-gray-500 mb-6">We have received your information and a pastor will be in touch shortly.</p>
               <Button onClick={resetForm} variant="outline">Submit Another Connection Card</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <img 
            src={CHURCH_LOGO_URL} 
            alt="Church Logo" 
            className="mx-auto h-24 w-24 rounded-full shadow-md object-cover border-4 border-white"
          />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            {CHURCH_NAME}
          </h1>
          <div className="mt-2 flex items-center justify-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{CHURCH_ADDRESS}</span>
          </div>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            We are honored you are here. Please fill out this card so we can get to know you better.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
             <h3 className="text-lg font-medium leading-6 text-gray-900">First Time Visitor Form</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {/* Personal Information Section */}
            <div>
              <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center">
                <UserPlus className="w-4 h-4 mr-2" /> Personal Details
              </h4>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <InputField 
                  label="First Name" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="John"
                />
                <InputField 
                  label="Last Name" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Doe"
                />
                <InputField 
                  label="Email Address" 
                  type="email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="john.doe@example.com"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                  <select
                    name="ageRange"
                    value={formData.ageRange}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  >
                    {Object.values(AgeRange).map((age) => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Address & Location
              </h4>
              <div className="space-y-4">
                <InputField 
                  label="Street Address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="123 Main St"
                />
                <InputField 
                  label="City, State, Zip" 
                  name="cityStateZip" 
                  value={formData.cityStateZip} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Springfield, IL 62704"
                />
              </div>
            </div>

            {/* Spiritual Section */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4 flex items-center">
                <Heart className="w-4 h-4 mr-2" /> Prayer & Connect
              </h4>
              
              <div className="space-y-6">
                <InputField 
                  label="How can we pray for you today?" 
                  name="prayerRequest" 
                  value={formData.prayerRequest} 
                  onChange={handleInputChange} 
                  textarea 
                  placeholder="Share your prayer request here..."
                />

                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-3">
                    Are you interested in becoming a member?
                  </span>
                  <div className="flex space-x-4">
                    {['yes', 'no', 'maybe'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="membershipInterest"
                          value={option}
                          checked={formData.membershipInterest === option}
                          onChange={handleInputChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700 capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" isLoading={isLoading}>
                Submit Connection Card
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 pb-8">
          <p>&copy; {new Date().getFullYear()} {CHURCH_NAME}. All rights reserved.</p>
          <p className="mt-1">{CHURCH_ADDRESS}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
