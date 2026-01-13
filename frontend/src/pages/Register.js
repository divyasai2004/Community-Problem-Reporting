import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/users/register", form);
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      alert("Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="gradient-bar"></div>
        
        <div className="auth-content">
          <div className="auth-header">
            <div className="auth-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2>Join Our Community</h2>
            <p>Help make your neighborhood better by reporting issues</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

// import { useState } from "react";

// function Register() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.email || !form.password) {
//       alert("Please fill in all fields");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       // Replace with: await API.post("/users/register", form);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       alert("Registration successful!");
//       setForm({ name: "", email: "", password: "" });
//     } catch (err) {
//       alert("Error registering user");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       width: '100%',
//       background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 50%, #1a1a1a 100%)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '20px',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
//     }}>
//       <div style={{
//         width: '100%',
//         maxWidth: '440px',
//         background: '#0a0a0a',
//         borderRadius: '16px',
//         border: '1px solid #2a2a2a',
//         boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
//         overflow: 'hidden'
//       }}>
//         {/* Top gradient bar */}
//         <div style={{
//           height: '4px',
//           background: 'linear-gradient(90deg, #9333ea 0%, #3b82f6 50%, #06b6d4 100%)'
//         }}></div>
        
//         <div style={{ padding: '40px' }}>
//           {/* Header */}
//           <div style={{ textAlign: 'center', marginBottom: '40px' }}>
//             <div style={{
//               width: '70px',
//               height: '70px',
//               background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
//               borderRadius: '50%',
//               display: 'inline-flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               marginBottom: '20px',
//               boxShadow: '0 8px 24px rgba(147, 51, 234, 0.4)'
//             }}>
//               <svg style={{ width: '35px', height: '35px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             </div>
//             <h2 style={{
//               fontSize: '32px',
//               fontWeight: 'bold',
//               color: 'white',
//               marginBottom: '8px',
//               letterSpacing: '-0.5px'
//             }}>Join Our Community</h2>
//             <p style={{
//               color: '#9ca3af',
//               fontSize: '15px'
//             }}>Help make your neighborhood better by reporting issues</p>
//           </div>

//           {/* Form Fields */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//             {/* Name Input */}
//             <div>
//               <label style={{
//                 display: 'block',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 color: '#d1d5db',
//                 marginBottom: '8px'
//               }}>Full Name</label>
//               <input
//                 name="name"
//                 placeholder="Enter your full name"
//                 onChange={handleChange}
//                 value={form.name}
//                 style={{
//                   width: '100%',
//                   padding: '12px 16px',
//                   background: '#1a1a1a',
//                   border: '1px solid #404040',
//                   borderRadius: '10px',
//                   color: 'white',
//                   fontSize: '15px',
//                   outline: 'none',
//                   transition: 'all 0.3s',
//                   boxSizing: 'border-box'
//                 }}
//                 onFocus={(e) => e.target.style.borderColor = '#9333ea'}
//                 onBlur={(e) => e.target.style.borderColor = '#404040'}
//               />
//             </div>

//             {/* Email Input */}
//             <div>
//               <label style={{
//                 display: 'block',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 color: '#d1d5db',
//                 marginBottom: '8px'
//               }}>Email Address</label>
//               <input
//                 name="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 onChange={handleChange}
//                 value={form.email}
//                 style={{
//                   width: '100%',
//                   padding: '12px 16px',
//                   background: '#1a1a1a',
//                   border: '1px solid #404040',
//                   borderRadius: '10px',
//                   color: 'white',
//                   fontSize: '15px',
//                   outline: 'none',
//                   transition: 'all 0.3s',
//                   boxSizing: 'border-box'
//                 }}
//                 onFocus={(e) => e.target.style.borderColor = '#9333ea'}
//                 onBlur={(e) => e.target.style.borderColor = '#404040'}
//               />
//             </div>

//             {/* Password Input */}
//             <div>
//               <label style={{
//                 display: 'block',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 color: '#d1d5db',
//                 marginBottom: '8px'
//               }}>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Create a strong password"
//                 onChange={handleChange}
//                 value={form.password}
//                 style={{
//                   width: '100%',
//                   padding: '12px 16px',
//                   background: '#1a1a1a',
//                   border: '1px solid #404040',
//                   borderRadius: '10px',
//                   color: 'white',
//                   fontSize: '15px',
//                   outline: 'none',
//                   transition: 'all 0.3s',
//                   boxSizing: 'border-box'
//                 }}
//                 onFocus={(e) => e.target.style.borderColor = '#9333ea'}
//                 onBlur={(e) => e.target.style.borderColor = '#404040'}
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               style={{
//                 width: '100%',
//                 padding: '14px',
//                 background: 'linear-gradient(90deg, #9333ea 0%, #3b82f6 100%)',
//                 border: 'none',
//                 borderRadius: '10px',
//                 color: 'white',
//                 fontSize: '16px',
//                 fontWeight: '600',
//                 cursor: isLoading ? 'not-allowed' : 'pointer',
//                 opacity: isLoading ? 0.6 : 1,
//                 transition: 'all 0.3s',
//                 marginTop: '8px'
//               }}
//               onMouseOver={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
//               onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
//             >
//               {isLoading ? 'Creating Account...' : 'Create Account'}
//             </button>
//           </div>

//           {/* Footer */}
//           <div style={{ marginTop: '28px', textAlign: 'center' }}>
//             <p style={{ color: '#9ca3af', fontSize: '14px' }}>
//               Already have an account?{' '}
//               <button
//                 onClick={() => alert('Navigate to sign in')}
//                 style={{
//                   color: '#a78bfa',
//                   background: 'none',
//                   border: 'none',
//                   cursor: 'pointer',
//                   fontWeight: '500',
//                   fontSize: '14px'
//                 }}
//               >
//                 Sign in here
//               </button>
//             </p>
//           </div>
//         </div>
        
//         {/* Bottom text */}
//         <div style={{
//           padding: '20px',
//           background: '#050505',
//           borderTop: '1px solid #1a1a1a',
//           textAlign: 'center'
//         }}>
//           <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
//             By registering, you agree to help improve your community
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;