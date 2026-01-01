// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, Lock, User, Chrome, ArrowRight, CheckCircle } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const Signin = () => {
//   const navigate = useNavigate();
//   const { signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  
//   const [isLogin, setIsLogin] = useState(true); // Toggle Login/Signup
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMsg('');
//     setSuccessMsg('');

//     try {
//       if (isLogin) {
//         // --- XỬ LÝ ĐĂNG NHẬP ---
//         const { error } = await loginWithEmail(formData.email, formData.password);
//         if (error) throw error;
//         navigate('/');
//       } else {
//         // --- XỬ LÝ ĐĂNG KÝ ---
//         const { error } = await registerWithEmail(formData.email, formData.password, formData.fullName);
//         if (error) throw error;
//         setSuccessMsg('Registration successful! Please check your email to confirm.');
//         setIsLogin(true); // Chuyển về tab login
//       }
//     } catch (error) {
//       setErrorMsg(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#fff8f0] flex items-center justify-center p-4 pt-24 font-['Poppins']">
      
//       <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row min-h-150">
        
//         {/* --- CỘT TRÁI: HÌNH ẢNH --- */}
//         <div className="w-full md:w-1/2 relative hidden md:block">
//             <img 
//                 src="https://img.freepik.com/free-photo/delicious-burger-with-fresh-ingredients_23-2150857908.jpg" 
//                 alt="Food Login" 
//                 className="absolute inset-0 w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-[#9e1c20]/80 mix-blend-multiply"></div>
//             <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center z-10">
//                 <h2 className="text-4xl font-black font-['Oleo_Script'] mb-4">Welcome Back!</h2>
//                 <p className="text-lg opacity-90">
//                     Join TasteNest to order delicious food and book tables easily. Good food is waiting for you!
//                 </p>
//             </div>
//         </div>

//         {/* --- CỘT PHẢI: FORM --- */}
//         <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
             
//              {/* Header Form */}
//              <div className="text-center mb-8">
//                 <h2 className="text-3xl font-black text-gray-900 mb-2">
//                     {isLogin ? 'Sign In' : 'Create Account'}
//                 </h2>
//                 <p className="text-gray-500 text-sm">
//                     {isLogin ? 'Enter your details to access your account' : 'Fill in the details below to get started'}
//                 </p>
//              </div>

//              {/* Social Login Button */}
//              <button 
//                 onClick={signInWithGoogle}
//                 className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-3 rounded-xl hover:bg-gray-50 transition-all text-gray-700 font-bold mb-6"
//              >
//                 <Chrome size={20} className="text-blue-500" />
//                 Continue with Google
//              </button>

//              <div className="relative flex py-2 items-center mb-6">
//                 <div className="grow border-t border-gray-200"></div>
//                 <span className="shrink-0 mx-4 text-gray-400 text-xs uppercase">Or with email</span>
//                 <div className="grow border-t border-gray-200"></div>
//              </div>

//              {/* Form Input */}
//              <form onSubmit={handleSubmit} className="space-y-5">
                
//                 {/* Full Name (Chỉ hiện khi Đăng ký) */}
//                 <AnimatePresence>
//                     {!isLogin && (
//                         <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
//                             <div className="relative">
//                                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                                 <input 
//                                     type="text" name="fullName" placeholder="Full Name" required={!isLogin}
//                                     value={formData.fullName} onChange={handleChange}
//                                     className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20]"
//                                 />
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 <div className="relative">
//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                     <input 
//                         type="email" name="email" placeholder="Email Address" required
//                         value={formData.email} onChange={handleChange}
//                         className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20]"
//                     />
//                 </div>

//                 <div className="relative">
//                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//                     <input 
//                         type="password" name="password" placeholder="Password" required
//                         value={formData.password} onChange={handleChange}
//                         className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20]"
//                     />
//                 </div>

//                 {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
//                 {successMsg && <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded border border-green-200">{successMsg}</p>}

//                 <button 
//                     disabled={loading}
//                     className="w-full bg-[#9e1c20] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70"
//                 >
//                     {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign Up')} 
//                     {!loading && <ArrowRight size={18} />}
//                 </button>
//              </form>

//              {/* Footer Toggle */}
//              <div className="text-center mt-8 text-sm text-gray-500">
//                 {isLogin ? "Don't have an account? " : "Already have an account? "}
//                 <button 
//                     onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); setSuccessMsg(''); }}
//                     className="text-[#9e1c20] font-bold hover:underline"
//                 >
//                     {isLogin ? 'Sign Up' : 'Sign In'}
//                 </button>
//              </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Chrome, ArrowRight, CheckCircle, MailCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signin = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Signup
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // 👇 THÊM STATE NÀY ĐỂ QUẢN LÝ MÀN HÌNH THÀNH CÔNG
  const [showSuccessScreen, setShowSuccessScreen] = useState(false); 

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // --- XỬ LÝ ĐĂNG NHẬP ---
        const { error } = await loginWithEmail(formData.email, formData.password);
        if (error) throw error;
        navigate('/');
      } else {
        // --- XỬ LÝ ĐĂNG KÝ ---
        const { error } = await registerWithEmail(formData.email, formData.password, formData.fullName);
        if (error) throw error;
        
        // 👇 THAY VÌ HIỆN TEXT NHỎ, BẬT MÀN HÌNH SUCCESS
        setShowSuccessScreen(true);
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- MÀN HÌNH THÔNG BÁO KIỂM TRA EMAIL ---
  if (showSuccessScreen) {
      return (
        <div className="min-h-screen w-full bg-[#fff8f0] flex items-center justify-center p-4 font-['Poppins']">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[30px] shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <MailCheck size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Check Your Inbox!</h2>
                <p className="text-gray-500 mb-6">
                    We've sent a confirmation link to: <br/>
                    <span className="font-bold text-gray-800">{formData.email}</span>
                </p>
                <p className="text-sm text-gray-400 mb-8">
                    Please click the link in that email to activate your account. Then you can sign in.
                </p>
                
                <div className="space-y-3">
                    <button 
                        onClick={() => window.open('https://mail.google.com', '_blank')}
                        className="w-full bg-[#9e1c20] text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all"
                    >
                        Open Gmail
                    </button>
                    <button 
                        onClick={() => { setShowSuccessScreen(false); setIsLogin(true); }}
                        className="w-full bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Back to Sign In
                    </button>
                </div>
            </motion.div>
        </div>
      );
  }

  // --- MÀN HÌNH FORM BÌNH THƯỜNG ---
  return (
    <div className="min-h-screen w-full bg-[#fff8f0] flex items-center justify-center p-4 pt-24 font-['Poppins']">
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row min-h-150">
        
        {/* CỘT TRÁI: HÌNH ẢNH (Giữ nguyên) */}
        <div className="w-full md:w-1/2 relative hidden md:block">
            <img 
                src="https://img.freepik.com/free-photo/delicious-burger-with-fresh-ingredients_23-2150857908.jpg" 
                alt="Food Login" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#9e1c20]/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center z-10">
                <h2 className="text-4xl font-black font-['Oleo_Script'] mb-4">Welcome Back!</h2>
                <p className="text-lg opacity-90">
                    Join TasteNest to order delicious food and book tables easily. Good food is waiting for you!
                </p>
            </div>
        </div>

        {/* CỘT PHẢI: FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-gray-500 text-sm">
                    {isLogin ? 'Enter your details to access your account' : 'Fill in the details below to get started'}
                </p>
             </div>

             <button 
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-3 rounded-xl hover:bg-gray-50 transition-all text-gray-700 font-bold mb-6"
             >
                <Chrome size={20} className="text-blue-500" />
                Continue with Google
             </button>

             <div className="relative flex py-2 items-center mb-6">
                <div className="grow border-t border-gray-200"></div>
                <span className="shrink-0 mx-4 text-gray-400 text-xs uppercase">Or with email</span>
                <div className="grow border-t border-gray-200"></div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                    {!isLogin && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" name="fullName" placeholder="Full Name" required={!isLogin}
                                    value={formData.fullName} onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20]"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="email" name="email" placeholder="Email Address" required
                        value={formData.email} onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20]"
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="password" name="password" placeholder="Password" required
                        value={formData.password} onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#9e1c20] focus:ring-1 focus:ring-[#9e1c20]"
                    />
                </div>

                {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

                <button 
                    disabled={loading}
                    className="w-full bg-[#9e1c20] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')} 
                    {!loading && <ArrowRight size={18} />}
                </button>
             </form>

             <div className="text-center mt-8 text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                    className="text-[#9e1c20] font-bold hover:underline"
                >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;