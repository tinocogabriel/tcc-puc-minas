import React, { useState, useEffect } from "react";

import Navbar from "../Navbar/Navbar";
import api from "../../services/api";

import { Modal, Table, Input, Select, Button, Form, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import "./styles.css";
export default function Cliente() {
  const [clientes, setClientes] = useState([]);

  const [searchAttribute, setSearchAttribute] = useState("cpf");
  const [searchText, setSearchText] = useState("");

  const [visibleInsert, setVisibleInsert] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [loadingInsert, setLoadingInsert] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [idCliente, setIdCliente] = useState("");
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getData();
  }, []);

  const getData = async (attribute, text) => {
    const response = await api.get(
      attribute && text ? `cliente/${attribute}/${text}` : `cliente`
    );
    setClientes(response.data.slice(0, 36));
  };

  const columns = [
    {
      title: "Matrícula",
      dataIndex: "id_cliente",
      key: "id_cliente",
      width: 100,
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      width: 200,
    },
    {
      title: "Endereço",
      dataIndex: "endereco",
      key: "endereco",
      width: 300,
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
      width: 150,
    },
    {
      title: "RG",
      dataIndex: "rg",
      key: "rg",
      width: 150,
    },
    {
      title: "Editar",
      key: "editar",
      width: 100,
      render: (text, record) => (
        <EditOutlined
          onClick={() => {
            setIdCliente(record.id_cliente);
            setNome(record.nome);
            setRg(record.rg);
            setCpf(record.cpf);
            setEndereco(record.endereco);
            setUsuario(record.acesso.usuario);
            setSenha(record.acesso.senha);
            setTimeout(() => {
              setVisibleEdit(true);
              formEdit.resetFields(); 
              formEdit.setFieldsValue(); 
            }, 250);
          }}
        />
      ),
    },
    {
      title: "Excluir",
      key: "excluir",
      width: 100,
      render: (text, record) => (
        <DeleteOutlined
          onClick={() => {
            showDeleteConfirm(record.id_cliente, record.nome);
          }}
        />
      ),
    },
  ];

  const [formNew] = Form.useForm();
  const [formEdit] = Form.useForm();

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const handleSave = () => {
    setLoadingInsert(true);
    formNew
      .validateFields()
      .then(async ({ nome, rg, cpf, endereco, usuario, senha }) => {
        try {
          const response = await api.post("cliente", {
            nome,
            rg,
            cpf,
            endereco,
            id_perfil: 1,
            usuario,
            senha,
          });
          if (response.status === 200 || response.status === 201) {
            getData(searchAttribute, searchText);
            Modal.destroyAll();
            setLoadingInsert(false);
            setVisibleInsert(false);
            message.success("Cliente criado com sucesso!");
          }
        } catch (error) {
          if (error.response) message.error(error.response.data.error);
          else
            message.error(
              "Ocorreu um erro na tentativa de cadastro do cliente, tente novamente."
            );
          setLoadingInsert(false);
        }
      })
      .catch((info) => {
        setLoadingInsert(false);
      });
  };

  const handleEdit = () => {
    setLoadingEdit(true);
    formEdit
      .validateFields()
      .then(async ({ nome, rg, cpf, endereco, usuario, senha }) => {
        try {
          const response = await api.put(`cliente/${idCliente}`, {
            nome,
            rg,
            cpf,
            endereco,
            id_perfil: 1,
            usuario,
            senha,
          });
          if (response.status === 200 || response.status === 201) {
            getData(searchAttribute, searchText);
            message.success("Cliente atualizado com sucesso!");
            Modal.destroyAll();
            setLoadingEdit(false);
            setVisibleEdit(false);
          }
        } catch (error) {
          if (error.response) message.error(error.response.data.error);
          else
            message.error(
              "Ocorreu um erro na tentativa de atualização do cliente, tente novamente."
            );
          setLoadingEdit(false);
        }
      })
      .catch((info) => {
        setLoadingEdit(false);
      });
  };

  const handleDelete = async (id_cliente) => {
    try {
      const response = await api.delete(`cliente/${id_cliente}`);
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        getData(searchAttribute, searchText);
        Modal.destroyAll();
        message.success("Cliente excluído com sucesso!");
      }
    } catch (error) {
      if (error.response) message.error(error.response.data.error);
      else
        message.error(
          "Ocorreu um erro na tentativa de cadastro do cliente, tente novamente."
        );
    }
  };

  const showDeleteConfirm = (id_cliente, nome) => {
    Modal.confirm({
      title: "Excluir Cliente",
      content: `Tem certeza que deseja excluir o cliente ${nome}`,
      okText: "Sim",
      okType: "primary",
      cancelText: "Não",
      onOk() {
        handleDelete(id_cliente);
      },
      onCancel() {
        Modal.destroyAll();
      },
    });
  };

  return (
    <div className="cliente-container">
      <Navbar />
      {user && user.id_perfil !== 3 ? (
        <h2 style={{ opacity: "0.5", textAlign: "center" }}>
          Você não possui acesso a essa funcionalidade!
        </h2>
      ) : (
        <>
          <div className="box">
            <h1 className="searchAreaTitle">Buscar Clientes</h1>
            <div className="searchArea">
              <Select
                className="searchAttribute"
                value={searchAttribute}
                size="large"
                onChange={(value) => {
                  setSearchAttribute(value);
                }}
              >
                <Select.Option value="cpf">CPF</Select.Option>
                <Select.Option value="id_cliente">Matrícula</Select.Option>
                <Select.Option value="nome">Nome</Select.Option>
              </Select>
              <Input.Search
                size="large"
                allowClear
                className="searchText"
                placeholder="Digite aqui o texto que será pesquisado"
                value={searchText}
                enterButton
                onSearch={(text) => {
                  getData(searchAttribute, text);
                }}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
            </div>
            <div style={{ margin: "20px 0", textAlign: "right" }}>
              <Button
                type="primary"
                size="large"
                icon={<UserAddOutlined />}
                onClick={() => {
                  formNew.resetFields();
                  setVisibleInsert(true);
                }}
              >
                Novo Cliente
              </Button>
            </div>
            <Table
              size="small"
              scroll={{ y: 300 }}
              columns={columns}
              dataSource={clientes}
            />
          </div>
          <Modal
            visible={visibleInsert}
            title="Novo Cliente"
            destroyOnClose={true}
            onCancel={() => {
              setVisibleInsert(false);
              Modal.destroyAll();
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setVisibleInsert(false);
                  Modal.destroyAll();
                }}
              >
                Cancelar
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loadingInsert}
                onClick={handleSave}
              >
                Salvar
              </Button>,
            ]}
            onOk={handleSave}
          >
            <Form {...layout} form={formNew} name="new-cliente">
              <Form.Item
                label="Nome"
                name="nome"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo nome!",
                  },
                ]}
              >
                <Input
                  placeholder="Nome do Cliente"
                  maxLength="150"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="RG"
                name="rg"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo RG!",
                  },
                ]}
              >
                <Input
                  placeholder="RG do Cliente"
                  maxLength="15"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="CPF"
                name="cpf"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo CPF!",
                  },
                ]}
              >
                <Input
                  placeholder="CPF do Cliente"
                  maxLength="14"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Endereço"
                name="endereco"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo Endereço!",
                  },
                ]}
              >
                <Input
                  placeholder="Endereço do Cliente"
                  maxLength="150"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Usuário"
                name="usuario"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo Usuário!",
                  },
                ]}
              >
                <Input
                  placeholder="Usuário do Cliente"
                  maxLength="25"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Senha"
                name="senha"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo Senha!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Senha do Cliente"
                  maxLength="20"
                  size="large"
                />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            visible={visibleEdit}
            title={`Editar Cliente - ${nome}`}
            destroyOnClose={true}
            onCancel={() => {
              setVisibleEdit(false);
              Modal.destroyAll();
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setVisibleEdit(false);
                  Modal.destroyAll();
                }}
              >
                Cancelar
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loadingEdit}
                onClick={handleEdit}
              >
                Editar
              </Button>,
            ]}
            onOk={handleEdit}
          >
            <Form {...layout} form={formEdit} name="edit-cliente">
              <Form.Item
                label="Nome"
                name="nome"
                initialValue={nome}
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo nome!",
                  },
                ]}
              >
                <Input
                  placeholder="Nome do Cliente"
                  maxLength="150"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="RG"
                name="rg"
                initialValue={rg}
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo RG!",
                  },
                ]}
              >
                <Input
                  placeholder="RG do Cliente"
                  maxLength="15"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="CPF"
                name="cpf"
                initialValue={cpf}
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo CPF!",
                  },
                ]}
              >
                <Input
                  placeholder="CPF do Cliente"
                  maxLength="14"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Endereço"
                name="endereco"
                initialValue={endereco}
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo Endereço!",
                  },
                ]}
              >
                <Input
                  placeholder="Endereço do Cliente"
                  maxLength="150"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Usuário"
                name="usuario"
                initialValue={usuario}
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo Usuário!",
                  },
                ]}
              >
                <Input
                  placeholder="Usuário do Cliente"
                  maxLength="25"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Senha"
                name="senha"
                initialValue={senha}
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo Senha!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Senha do Cliente"
                  maxLength="20"
                  size="large"
                />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
}
