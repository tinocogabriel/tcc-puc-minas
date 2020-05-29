import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Input, Select, Form, Button, message } from "antd";

import api from "../../services/api";
import "./styles.css";

import peopleImg from "../../assets/gym-people.png";
import logoImg from "../../assets/logo.png";

export default function Logon() {
  const [profiles, setProfiles] = useState([]);
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem("user");
    getProfiles();
  }, []);

  const getProfiles = async () => {
    const response = await api.get("/perfil");
    setProfiles(response.data);
  };
  const onFinish = async ({ username, password, profile }) => {
    try {
      const access = await api.get(`perfil/${profile}/acesso`, {
        auth: { username, password },
      });

      if (access && access.status === 200) {
        localStorage.setItem("user", JSON.stringify(access.data));
        history.push("/home");
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error);
      } else {
        message.error(
          "Ocorreu um erro na tentativa de acesso, por favor tente nomente."
        );
      }
    }
  };

  return (
    <div className="logon-container">
      <div className="box">
        <section className="form">
          <img src={logoImg} alt="logo-muscles-gym" />
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <h1>Faça seu login</h1>
            <Form.Item
              label=""
              name="username"
              rules={[
                {
                  required: true,
                  message: "Por favor, preencha o campo usuário!",
                },
              ]}
            >
              <Input placeholder="Usuário" size="large" />
            </Form.Item>

            <Form.Item
              label=""
              name="password"
              rules={[
                {
                  required: true,
                  message: "Por favor, preencha o campo senha!",
                },
              ]}
            >
              <Input.Password placeholder="Senha" size="large" />
            </Form.Item>
            <Form.Item
              label=""
              name="profile"
              rules={[
                {
                  required: true,
                  message: "Por favor, preencha o campo perfil!",
                },
              ]}
            >
              <Select placeholder="Perfil" size="large" allowClear>
                {profiles &&
                  profiles.map((item) => (
                    <Select.Option value={item.id_perfil} key={item.id_perfil}>
                      {item.descricao}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", height: "48px" }}
              >
                Acessar
              </Button>
            </Form.Item>
          </Form>
        </section>
        <img src={peopleImg} alt="people-gym" />
      </div>
    </div>
  );
}
