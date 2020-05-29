import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Menu, Tooltip } from "antd";
import {
  WalletOutlined,
  UserOutlined,
  AuditOutlined,
  CalendarOutlined,
  ReconciliationOutlined,
  TrophyOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

import './styles.css';

export default function Nav() {
  const [current, setCurrent] = useState(`${window.location.pathname}`);
  const history = useHistory();
  if (!localStorage.getItem("user")) history.push("/");

  const handleClick = (e) => {
    setCurrent(e.key);
    history.push(e.key);
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} className="navbarproject" mode="horizontal">
      <Menu.Item key="/cliente" icon={<UserOutlined />}>
        Cliente
      </Menu.Item>
      <Menu.Item key="/instrutor" icon={<AuditOutlined />}>
        Instrutor
      </Menu.Item>
      <Menu.Item key="/aula" icon={<CalendarOutlined />}>
        Aula
      </Menu.Item>
      <Menu.Item key="/pagamentos" disabled icon={<WalletOutlined />}>
        <Tooltip title="Em Desenvolvimento">Pagamentos</Tooltip>
      </Menu.Item>
      <Menu.Item
        key="/avalicao-fisica"
        disabled
        icon={<ReconciliationOutlined />}
      >
        <Tooltip title="Em Desenvolvimento">Avaliação Física</Tooltip>
      </Menu.Item>
      <Menu.Item key="/area-aluno" disabled icon={<TrophyOutlined />}>
        <Tooltip title="Em Desenvolvimento">Área do Aluno</Tooltip>
      </Menu.Item>

      <Menu.Item
        key="/"
        className="quit"
        onClick={() => {
          localStorage.removeItem("user");
        }}
      >
        <PoweroffOutlined />
      </Menu.Item>
    </Menu>
  );
}
