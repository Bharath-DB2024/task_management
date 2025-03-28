"use client";

import person from "@/assets/images/Person.png";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle, Modal, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useLayoutContext } from "@/context/useLayoutContext";

const ThemeCustomizer = dynamic(() => import("@/components/ThemeCustomizer"));


const ProfileDropdown = () => {
  const [user_name, setUserName] = useState("User");
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogoutConfirm = () => {
    setShowModal(true);
  };

  const handleLogout = () => {
    setShowModal(false);
    localStorage.clear();
    router.push("/auth/sign-in"); 
  };

  const {
    themeCustomizer: { open, toggle },
  } = useLayoutContext();

  const [hasOpenedOnce, setHasOpenedOnce] = useState(open);
  
  const toggleThemeCustomizerOffcanvas = () => {
    if (!hasOpenedOnce) setHasOpenedOnce(true);
    toggle();
  };


  return (
    <>
      <Dropdown className="topbar-item" drop="down">
        <DropdownToggle
          as="a"
          className="topbar-button content-none"
          id="page-header-user-dropdown"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="d-flex align-items-center">
            <Image
              className="rounded-circle"
              style={{ background: "#e2e2e2", opacity: "0.7", cursor: "pointer" }}
              width={35}
              src={person}
              alt="person"
            />
          </span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <DropdownHeader as="h6" className="dropdown-header">
            Welcome {user_name}
          </DropdownHeader>

          <DropdownItem as={Link} href="/support/faqs">
            <IconifyIcon icon="ri-question-line" className="align-middle me-2 fs-18" />
            <span className="align-middle">Help</span>
          </DropdownItem>

          <DropdownItem onClick={toggleThemeCustomizerOffcanvas} className="d-flex align-items-center">
            <IconifyIcon icon="ri:settings-4-line" className="fs-24 me-2" />
            <span className="align-middle">Settings</span>
          </DropdownItem>

          <div className="dropdown-divider my-1" />

          <DropdownItem className="text-danger" onClick={handleLogoutConfirm}>
            <IconifyIcon icon="ri-logout-box-line" className="align-middle me-2 fs-18" />
            <span className="align-middle">Logout</span>
          </DropdownItem>
        </DropdownMenu>

        {hasOpenedOnce && <ThemeCustomizer open={open} toggle={toggleThemeCustomizerOffcanvas} />}
      </Dropdown>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="info" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

};


export default ProfileDropdown;
