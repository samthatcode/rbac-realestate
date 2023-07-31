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
  UsersPage,
  CheckoutPage,
  ConfirmationPage,
  PaymentForm,
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
  EmailVerification,
  MarketerRegister,
  MarketerLogin,
  ClientSignup,
} from "./components";
import { UserProvider } from "./UserContext";
import { CartProvider } from "./CartContext";
import { MarketerProvider } from "./MarketerContext";
import { ReferralProvider } from "./ReferralsContext";

const App = () => {
  return (
    <UserProvider>
      <MarketerProvider>
        <ReferralProvider>
          <CartProvider>
            <div>
              <ToastContainer />
              <Navbar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/cart" element={<CartListPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/paymentform" element={<PaymentForm />} />
                  <Route path="/confirmation" element={<ConfirmationPage />} />
                  <Route path="/productform" element={<ProductForm />} />
                  <Route path="/products" element={<ProductPage />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/manageusers" element={<UserManagement />} />
                  <Route
                    path="/manageproducts"
                    element={<ProductManagement />}
                  />
                  <Route
                    path="/managecategories"
                    element={<CategoryManagement />}
                  />
                  <Route path="/manageroles" element={<RoleManagement />} />
                  {/* Marketer */}
                  <Route
                    path="/marketerdashboard/:marketerId"
                    element={<MarketerDashboard />}
                  />
                  <Route
                    path="/marketer/signup"
                    element={<MarketerRegister />}
                  />
                  <Route path="/marketer/login" element={<MarketerLogin />} />
                  {/* Client */}
                  <Route path="/signup" element={<ClientSignup />} />


                  <Route path="/userdashboard" element={<UserDashboard />} />

                  <Route path="/admindashboard" element={<AdminDashboard />} />
                  <Route path="/create-event" element={<AdminDashboard />} />
                  <Route path="/eventdetails" element={<AdminDashboard />} />
                  <Route path="/eventlist" element={<AdminDashboard />} />

                  <Route
                    path="/verify-email/:token"
                    element={<EmailVerification />}
                  />
                  {/* <Route path="/verify-code" component={CodeVerification} /> */}
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
