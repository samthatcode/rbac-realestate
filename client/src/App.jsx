import React from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import {
  AdminDashboard,
  UserDashboard,
  MarketerDashboard,
  ProductPage,
  ProductDetails,
  CartListPage,
  CheckoutPage,
  ConfirmationPage,
  PaystackCheckout,
  LandDetails,
  LandPage,
  InvestmentPage,
  InvestmentDetails,
} from "./pages";
import {
  Navbar,
  Login,
  Signup,
  Home,
  UserEmailVerification,
  MarketerRegister,
  MarketerLogin,
  ForgotPassword,
  ResetPassword,
  MarketerEmailVerification,
  RegistrationForm,
  Referrals,
  MarketerForgotPassword,
  MarketerResetPassword,
  MarketerPayment,
  EventDetails,
} from "./components";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { MarketerProvider } from "./contexts/MarketerContext";
import { ReferralProvider } from "./contexts/ReferralsContext";
import ProtectedRoute from "./ProtectedRoute";
import { SearchProvider } from "./contexts/SearchContext";
import { SavedPropertiesProvider } from "./contexts/SavedPropertiesContext";

const App = () => {
  return (
    <UserProvider>
      <MarketerProvider>
        <ReferralProvider>
          <CartProvider>
            <SearchProvider>
              <SavedPropertiesProvider>
                <div>
                  <ToastContainer />
                  {/* <Navbar /> */}
                  <div className="content font-poppins">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/cart" element={<CartListPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route
                        path="/paystackcheckout"
                        element={<PaystackCheckout />}
                      />
                      <Route path="/confirm" element={<ConfirmationPage />} />
                      <Route path="/products" element={<ProductPage />} />
                      <Route path="/lands" element={<LandPage />} />
                      <Route path="/investments" element={<InvestmentPage />} />
                      <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                      />
                      <Route path="/lands/:id" element={<LandDetails />} />
                      <Route path="/investments/:id" element={<InvestmentDetails />} />
                      <Route
                        path="/events/:id"
                        element={<EventDetails />}
                      />
                      {/* Marketer */}

                      <Route
                        path="/marketer/dashboard/:marketerId"
                        element={
                          <ProtectedRoute roles={["marketer"]}>
                            <MarketerDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/marketer/signup"
                        element={<MarketerRegister />}
                      />
                      <Route
                        path="/marketer/login"
                        element={<MarketerLogin />}
                      />
                     <Route path="/marketer/payment/:marketerId" element={<MarketerPayment />} />

                      <Route
                        path="/registration"
                        element={<RegistrationForm />}
                      />
                      <Route
                        path="/referrals/:referral"
                        element={<Referrals />}
                      />
                      <Route
                        path="/verify-marketer-email/:token/:marketerId"
                        element={<MarketerEmailVerification />}
                      />

                      <Route
                        path="/marketer-forgot-password"
                        element={<MarketerForgotPassword />}
                      />
                      <Route
                        path="/marketer-reset/:resetToken"
                        element={<MarketerResetPassword />}
                      />
                      <Route
                        path="/user/dashboard"
                        element={<UserDashboard />}
                      />

                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute roles={["admin"]}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/verify-user-email/:token"
                        element={<UserEmailVerification />}
                      />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route
                        path="/reset/:resetToken"
                        element={<ResetPassword />}
                      />

                      {/* <Route path="/verify-code" element={CodeVerification} /> */}
                    </Routes>
                  </div>
                </div>
              </SavedPropertiesProvider>
            </SearchProvider>
          </CartProvider>
        </ReferralProvider>
      </MarketerProvider>
    </UserProvider>
  );
};

export default App;
