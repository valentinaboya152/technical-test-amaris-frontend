import Sidebar from "@/components/adminComp/AdminSidebarComp";
import TopNavbar from "@/components/main-navbarComp/MainNavbarComp";
import "./layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout-wrapper d-flex">
      <Sidebar />

      <div className="content-wrapper flex-grow-1">
        <TopNavbar />

        <div className="content p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
