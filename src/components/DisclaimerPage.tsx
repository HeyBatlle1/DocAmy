import React from 'react';
import { AlertTriangle, X, Shield, Heart, Activity, Stethoscope } from 'lucide-react';

interface DisclaimerPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-red-800/30">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-900/90 to-black/90 backdrop-blur-md p-6 border-b border-red-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  CRITICAL MEDICAL DISCLAIMER
                </h1>
                <p className="text-red-300">
                  Important Legal and Safety Information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-900/30"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Emergency Warning */}
          <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border-2 border-red-500 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-3">
                  🚨 EMERGENCY SITUATIONS - CALL 911 IMMEDIATELY 🚨
                </h2>
                <p className="text-red-200 text-lg leading-relaxed">
                  If you are experiencing a medical emergency, <strong>DO NOT USE THIS APPLICATION</strong>. 
                  Call 911 (US), 999 (UK), 112 (EU), or your local emergency services immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Main Disclaimer */}
          <div className="bg-black/30 rounded-xl p-6 border border-red-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">
                NOT A MEDICAL DOCTOR OR LICENSED HEALTHCARE PROVIDER
              </h2>
            </div>
            <div className="space-y-4 text-red-200">
              <p className="text-lg">
                <strong>DocAmy is an artificial intelligence application and is NOT:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A licensed medical doctor, physician, or healthcare provider</li>
                <li>A substitute for professional medical advice, diagnosis, or treatment</li>
                <li>Capable of providing emergency medical care</li>
                <li>Authorized to prescribe medications or treatments</li>
                <li>A replacement for in-person medical consultations</li>
              </ul>
            </div>
          </div>

          {/* SHTF Specific Warning */}
          <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-bold text-white">
                SHTF (Shit Hits The Fan) Emergency Scenarios
              </h2>
            </div>
            <div className="space-y-4 text-orange-200">
              <p className="text-lg font-semibold">
                This application is designed for informational purposes during emergency preparedness scenarios only.
              </p>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2">⚠️ CRITICAL LIMITATIONS:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cannot replace professional medical training or experience</li>
                  <li>Should only be used when professional medical care is unavailable</li>
                  <li>Information provided may be incomplete or inaccurate</li>
                  <li>Cannot account for individual medical conditions or allergies</li>
                  <li>Not suitable for complex medical procedures or surgeries</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Disclaimers */}
          <div className="bg-black/30 rounded-xl p-6 border border-red-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <Stethoscope className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">
                LEGAL DISCLAIMERS AND LIMITATIONS
              </h2>
            </div>
            <div className="space-y-6 text-red-200">
              <div>
                <h3 className="font-bold text-white mb-2">No Doctor-Patient Relationship</h3>
                <p>
                  Use of this application does not create a doctor-patient relationship. No confidentiality 
                  or privilege exists between you and DocAmy or its operators.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">No Liability</h3>
                <p>
                  The creators, operators, and distributors of DocAmy assume NO LIABILITY for any harm, 
                  injury, death, or damages resulting from the use or misuse of this application.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">Information Accuracy</h3>
                <p>
                  While we strive for accuracy, medical information provided may be outdated, incomplete, 
                  or incorrect. Always verify information with qualified medical professionals.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">Functioning World vs. SHTF Scenarios</h3>
                <p className="bg-red-900/30 p-3 rounded-lg border border-red-700/50">
                  <strong>In a functioning world:</strong> This application should NEVER be used as a 
                  substitute for professional medical care. Always consult licensed healthcare providers.
                  <br /><br />
                  <strong>In SHTF scenarios:</strong> Use only when professional medical care is completely 
                  unavailable and as a last resort for informational guidance only.
                </p>
              </div>
            </div>
          </div>

          {/* Age and Consent */}
          <div className="bg-black/30 rounded-xl p-6 border border-red-800/30">
            <h2 className="text-xl font-bold text-white mb-4">
              AGE RESTRICTIONS AND CONSENT
            </h2>
            <div className="space-y-3 text-red-200">
              <p>
                <strong>Minimum Age:</strong> You must be 18 years or older to use this application.
              </p>
              <p>
                <strong>Parental Supervision:</strong> Use by minors requires direct adult supervision 
                and should only occur in genuine emergency situations.
              </p>
              <p>
                <strong>Informed Consent:</strong> By using this application, you acknowledge that you 
                understand and accept all risks and limitations outlined in this disclaimer.
              </p>
            </div>
          </div>

          {/* When to Seek Professional Help */}
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-700/50">
            <h2 className="text-xl font-bold text-white mb-4">
              WHEN TO SEEK PROFESSIONAL MEDICAL HELP
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-green-200">
              <div>
                <h3 className="font-bold text-white mb-2">Immediate Emergency (Call 911):</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Chest pain or heart attack symptoms</li>
                  <li>Difficulty breathing or choking</li>
                  <li>Severe bleeding or trauma</li>
                  <li>Loss of consciousness</li>
                  <li>Stroke symptoms</li>
                  <li>Severe allergic reactions</li>
                  <li>Poisoning or overdose</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Urgent Care Needed:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>High fever (&gt;103°F/39.4°C)</li>
                  <li>Severe pain</li>
                  <li>Signs of infection</li>
                  <li>Persistent vomiting</li>
                  <li>Severe dehydration</li>
                  <li>Mental health crises</li>
                  <li>Medication reactions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Final Warning */}
          <div className="bg-gradient-to-r from-red-900/50 to-black/50 border-2 border-red-500 rounded-xl p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                ⚠️ FINAL WARNING ⚠️
              </h2>
              <p className="text-red-200 text-lg leading-relaxed">
                This application is provided "AS IS" without any warranties. Use at your own risk. 
                The information provided is for educational and preparedness purposes only and should 
                never replace professional medical judgment or care when available.
              </p>
              <div className="mt-4 p-4 bg-black/50 rounded-lg">
                <p className="text-red-300 font-bold">
                  By continuing to use DocAmy, you acknowledge that you have read, understood, 
                  and agree to all terms and limitations outlined in this disclaimer.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-black/30 rounded-xl p-6 border border-red-800/30">
            <h2 className="text-xl font-bold text-white mb-4">
              EMERGENCY CONTACT INFORMATION
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-red-200">
              <div>
                <h3 className="font-bold text-white">United States</h3>
                <p>Emergency: 911</p>
                <p>Poison Control: 1-800-222-1222</p>
              </div>
              <div>
                <h3 className="font-bold text-white">United Kingdom</h3>
                <p>Emergency: 999 or 112</p>
                <p>NHS: 111</p>
              </div>
              <div>
                <h3 className="font-bold text-white">European Union</h3>
                <p>Emergency: 112</p>
                <p>Local emergency services</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-red-900/90 to-black/90 backdrop-blur-md p-6 border-t border-red-800/50">
          <div className="flex items-center justify-between">
            <p className="text-red-300 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-900 transition-colors shadow-lg"
            >
              I Understand and Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};