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
} from "./pages";
import {
  Navbar,
  Login,
  Signup,
  Home,
  ProductForm,
  UserManagement,
  ProductManagement,
  CategoryManagement,
  RoleManagement,
  UserEmailVerification,
  MarketerRegister,
  MarketerLogin,
  ForgotPassword,
  ResetPassword,
  MarketerEmailVerification,
  RegistrationForm,
  Referrals,
  CreateEventForm,
  EventDetails,
  EventList,
  MarketerForgotPassword,
  MarketerResetPassword,
} from "./components";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { MarketerProvider } from "./contexts/MarketerContext";
import { ReferralProvider } from "./contexts/ReferralsContext";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <UserProvider>
      <MarketerProvider>
        <ReferralProvider>
          <CartProvider>
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
                  <Route path="/productform" element={<ProductForm />} />
                  <Route path="/products" element={<ProductPage />} />
                  <Route path="/products/:id" element={<ProductDetails />} />             
                  {/* <Route path="/manageusers" element={<UserManagement />} />
                  <Route
                    path="/manageproducts"
                    element={<ProductManagement />}
                  />
                  <Route
                    path="/managecategories"
                    element={<CategoryManagement />}
                  />
                  <Route path="/manageroles" element={<RoleManagement />} /> */}
                  {/* Marketer */}

                  <Route
                    path="/marketerdashboard/:marketerId"
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
                  <Route path="/marketer/login" element={<MarketerLogin />} />
                  <Route path="/registration" element={<RegistrationForm />} />
                  <Route path="/referrals/:referral" element={<Referrals />} />
                  <Route
                    path="/verify-marketer-email/:token"
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
                  <Route path="/userdashboard" element={<UserDashboard />} />

                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute roles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Events */}
                  {/* <Route path="/create-event" element={<CreateEventForm />} /> */}
                  {/* <Route path="/eventdetails" element={<EventDetails />} /> */}
                  {/* <Route path="/eventlist" element={<EventList />} /> */}
                  <Route
                    path="/verify-user-email/:token"
                    element={<UserEmailVerification />}
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/reset/:resetToken"
                    element={<ResetPassword />}
                  />

                  {/* <Route path="/verify-code" element={CodeVerification} /> */}
                </Routes>
              </div>
            </div>
          </CartProvider>
        </ReferralProvider>
      </MarketerProvider>
    </UserProvider>
  );
};

export default App;
