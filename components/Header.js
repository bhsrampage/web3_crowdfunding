import Link from "next/link";
import React from "react";
import { Menu } from "semantic-ui-react";

const Header = (props) => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link href={"/"}>
        <Menu.Item>CrowdCoin</Menu.Item>
      </Link>

      <Menu.Menu position="right">
        <Link href={"/"}>
          <Menu.Item>Campaigns</Menu.Item>
        </Link>
        <Link href={"/campaigns/new"}>
          <Menu.Item>+</Menu.Item>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
