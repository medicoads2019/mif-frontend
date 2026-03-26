import { Routes, Route } from "react-router-dom";

/* Layout */
import MainLayout from "./layout/MainLayout";
import { PublicOnlyRoute, RequireAuth } from "./components/auth/RouteGuards";

/* Pages */
import Dashboard from "./pages/Dashboard";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Unauthorized from "./pages/auth/Unauthorized";
import ProfileUpdate from "./pages/profile/ProfileUpdate";
import ChangePassword from "./pages/profile/ChangePassword";
import ProfileResetPassword from "./pages/profile/ResetPassword";

/* Festivals */
import Festivals from "./pages/festival/Festivals";
import CreateFestival from "./pages/festival/CreateFestival";
import EditFestival from "./pages/festival/EditFestival";
import TrashFestival from "./pages/festival/TrashFestival";

/* Categorys */
import Categorys from "./pages/category/Categorys";
import CreateCategory from "./pages/category/CreateCategory";
import EditCategory from "./pages/category/EditCategory";
import TrashCategory from "./pages/category/TrashCategory";

/* Businesss */
import Businesss from "./pages/business/Businesss";
import CreateBusiness from "./pages/business/CreateBusiness";
import EditBusiness from "./pages/business/EditBusiness";
import TrashBusiness from "./pages/business/TrashBusiness";

/* Banners */
import Banners from "./pages/banner/Banners";
import CreateBanner from "./pages/banner/CreateBanner";
import EditBanner from "./pages/banner/EditBanner";
import TrashBanner from "./pages/banner/TrashBanner";

/* DemoFrames */
import DemoFrames from "./pages/demoFrame/DemoFrames";
import CreateDemoFrame from "./pages/demoFrame/CreateDemoFrame";
import EditDemoFrame from "./pages/demoFrame/EditDemoFrame";
import TrashDemoFrame from "./pages/demoFrame/TrashDemoFrame";

/* BusinessFrames */
import BusinessFrames from "./pages/businessFrame/BusinessFrames";
import CreateBusinessFrame from "./pages/businessFrame/CreateBusinessFrame";
import EditBusinessFrame from "./pages/businessFrame/EditBusinessFrame";
import TrashBusinessFrame from "./pages/businessFrame/TrashBusinessFrame";

/* ClientFrames */
import ClientFrames from "./pages/clientFrame/ClientFrames";
import CreateClientFrame from "./pages/clientFrame/CreateClientFrame";
import EditClientFrame from "./pages/clientFrame/EditClientFrame";
import TrashClientFrame from "./pages/clientFrame/TrashClientFrame";

/* Clients */
import Clients from "./pages/client/Clients";
import CreateClient from "./pages/client/CreateClient";
import EditClient from "./pages/client/EditClient";
import TrashClient from "./pages/client/TrashClient";
import ClientLoginTesting from "./pages/client/ClientLoginTesting";

/* Image Download */
import ImageDownload from "./pages/imageDownload/ImageDownload";

/* Restrictions */
import Restrictions from "./pages/restrictions/Restrictions";
import ContactUs from "./pages/contactUs/ContactUs";
import AppContent from "./pages/appContent/AppContent";

/* Employees */
import Employees from "./pages/employee/Employees";
import CreateEmployee from "./pages/employee/CreateEmployee";
import EditEmployee from "./pages/employee/EditEmployee";
import TrashEmployee from "./pages/employee/TrashEmployee";
import EmployeeLoginTesting from "./pages/employee/EmployeeLoginTesting";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/auth/login"
        element={
          <PublicOnlyRoute>
            <EmployeeLogin />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPassword />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          <PublicOnlyRoute>
            <ResetPassword />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Festivals */}
        <Route path="/festivals" element={<Festivals />} />
        <Route path="/festivals/create" element={<CreateFestival />} />
        <Route path="/festivals/:id" element={<EditFestival />} />
        <Route path="/festivals/trash" element={<TrashFestival />} />

        {/* Categorys */}
        <Route path="/categorys" element={<Categorys />} />
        <Route path="/categorys/create" element={<CreateCategory />} />
        <Route path="/categorys/:id" element={<EditCategory />} />
        <Route path="/categorys/trash" element={<TrashCategory />} />

        {/* Businesss */}
        <Route path="/businesss" element={<Businesss />} />
        <Route path="/businesss/create" element={<CreateBusiness />} />
        <Route path="/businesss/:id" element={<EditBusiness />} />
        <Route path="/businesss/trash" element={<TrashBusiness />} />

        {/* Banners */}
        <Route path="/banners" element={<Banners />} />
        <Route path="/banners/create" element={<CreateBanner />} />
        <Route path="/banners/:id" element={<EditBanner />} />
        <Route path="/banners/trash" element={<TrashBanner />} />

        {/* DemoFrames */}
        <Route path="/demoFrames" element={<DemoFrames />} />
        <Route path="/demoFrames/create" element={<CreateDemoFrame />} />
        <Route path="/demoFrames/:id" element={<EditDemoFrame />} />
        <Route path="/demoFrames/trash" element={<TrashDemoFrame />} />

        {/* BusinessFrames */}
        <Route path="/businessFrames" element={<BusinessFrames />} />
        <Route
          path="/businessFrames/create"
          element={<CreateBusinessFrame />}
        />
        <Route path="/businessFrames/:id" element={<EditBusinessFrame />} />
        <Route path="/businessFrames/trash" element={<TrashBusinessFrame />} />

        {/* ClientFrames */}
        <Route path="/clientFrames" element={<ClientFrames />} />
        <Route path="/clientFrames/create" element={<CreateClientFrame />} />
        <Route path="/clientFrames/:id" element={<EditClientFrame />} />
        <Route path="/clientFrames/trash" element={<TrashClientFrame />} />

        {/* Clients */}
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/create" element={<CreateClient />} />
        <Route path="/clients/login-testing" element={<ClientLoginTesting />} />
        <Route path="/clients/:id" element={<EditClient />} />
        <Route path="/clients/trash" element={<TrashClient />} />

        {/* Employees */}
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/create" element={<CreateEmployee />} />
        <Route
          path="/employees/login-testing"
          element={<EmployeeLoginTesting />}
        />
        <Route path="/employees/:id" element={<EditEmployee />} />
        <Route path="/employees/trash" element={<TrashEmployee />} />

        {/* Image Download */}
        <Route path="/image-download" element={<ImageDownload />} />

        {/* Contact Us */}
        <Route path="/contact-us" element={<ContactUs />} />

        {/* Legal Content */}
        <Route path="/legal-content" element={<AppContent />} />

        {/* Restrictions */}
        <Route path="/restrictions" element={<Restrictions />} />

        {/* Profile */}
        <Route path="/profile/update" element={<ProfileUpdate />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
        <Route
          path="/profile/reset-password"
          element={<ProfileResetPassword />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
}
