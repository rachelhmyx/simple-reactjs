import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import React from "react";
import numeral from "numeral";
import "numeral/locales/vi"; //vi là mã của ngôn ngữ
import "./App.css";
import Employees from "./pages/Management/Employees";
import Categories from "./pages/Management/Categories";
import Customers from "./pages/Management/Customers";
import Suppliers from "./pages/Management/Suppliers";
import Products from "./pages/Management/Products";
import SearchOrdersByStatus from "./pages/Sales/Orders/SearchOrdersByStatus";
import SearchOrdersByPaymentType from "./pages/Sales/Orders/SearchOrdersByPaymentType";
import Home from "./pages/Home";
import SideMenuBar from "../src/components/SideMenuBar";

numeral.locale("vi");
const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Sider style={{ minHeight: "100vh" }}>
            <SideMenuBar />
          </Sider>
          <Layout>
            <Header>Header</Header>
            <Content>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/management/employees" element={<Employees />} />
                <Route path="/management/categories" element={<Categories />} />
                <Route path="/management/customers" element={<Customers />} />
                <Route path="/management/suppliers" element={<Suppliers />} />
                <Route path="/management/products" element={<Products />} />

                {/* SALES */}
                <Route
                  path="/sales/orders/status"
                  element={<SearchOrdersByStatus />}
                />
                <Route
                  path="/sales/orders/paymenttype"
                  element={<SearchOrdersByPaymentType />}
                />

                {/* NO MATCH ROUTE */}
                <Route
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>404 Page not found</p>
                    </main>
                  }
                />
              </Routes>
            </Content>
            <Footer>Footer</Footer>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
