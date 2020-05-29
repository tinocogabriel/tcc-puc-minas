import React, { useState, useEffect } from "react";

import Navbar from "../Navbar/Navbar";
import api from "../../services/api";

import {
  Modal,
  Table,
  Input,
  Select,
  Button,
  Form,
  message,
  Tooltip,
  Checkbox,
  Row,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import "./styles.css";
export default function Instrutor() {
  const [instrutores, setInstrutores] = useState([]);
  const [listaAtividades, setListaAtividades] = useState([]);

  const [searchAttribute, setSearchAttribute] = useState("cpf");
  const [searchText, setSearchText] = useState("");

  const [visibleInsert, setVisibleInsert] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [loadingInsert, setLoadingInsert] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [idInstrutor, setIdInstrutor] = useState("");
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [atividades, setAtividades] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getData();
    getListaAtividades();
  }, []);

  const getData = async (attribute, text) => {
    const response = await api.get(
      attribute && text ? `instrutor/${attribute}/${text}` : `instrutor`
    );
    setInstrutores(response.data.slice(0, 36));
  };

  const getListaAtividades = async () => {
    const response = await api.get(`atividade`);
    setListaAtividades(response.data);
  };

  const columns = [
    {
      title: "Cód. Instrutor",
      dataIndex: "id_instrutor",
      key: "id_instrutor",
      width: 100,
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      width: 200,
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
      title: "Atividades",
      key: "atividades",
      width: 100,
      render: (text, record) => (
        <Tooltip
          title={record.atividade.map((item) => (
            <li>{item.descricao}</li>
          ))}
        >
          <UnorderedListOutlined />
        </Tooltip>
      ),
    },
    {
      title: "Editar",
      key: "editar",
      width: 100,
      render: (text, record) => (
        <EditOutlined
          onClick={() => {
            setIdInstrutor(record.id_instrutor);
            setNome(record.nome);
            setRg(record.rg);
            setCpf(record.cpf);
            setAtividades(record.atividade.map((item) => item.id_atividade));
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
            showDeleteConfirm(record.id_instrutor, record.nome);
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
      .then(async ({ nome, rg, cpf, atividades, usuario, senha }) => {
        try {
          const response = await api.post("instrutor", {
            nome,
            rg,
            cpf,
            atividades: atividades,
            id_perfil: 2,
            usuario,
            senha,
          });
          if (response.status === 200 || response.status === 201) {
            getData(searchAttribute, searchText);
            Modal.destroyAll();
            setLoadingInsert(false);
            setVisibleInsert(false);
            message.success("Instrutor criado com sucesso!");
          }
        } catch (error) {
          if (error.response) message.error(error.response.data.error);
          else
            message.error(
              "Ocorreu um erro na tentativa de cadastro do instrutor, tente novamente."
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
      .then(async ({ nome, rg, cpf, atividades, usuario, senha }) => {
        try {
          const response = await api.put(`instrutor/${idInstrutor}`, {
            nome,
            rg,
            cpf,
            atividades,
            id_perfil: 2,
            usuario,
            senha,
          });
          if (response.status === 200 || response.status === 201) {
            getData(searchAttribute, searchText);
            message.success("Instrutor atualizado com sucesso!");
            Modal.destroyAll();
            setLoadingEdit(false);
            setVisibleEdit(false);
          }
        } catch (error) {
          if (error.response) message.error(error.response.data.error);
          else
            message.error(
              "Ocorreu um erro na tentativa de atualização do instrutor, tente novamente."
            );
          setLoadingEdit(false);
        }
      })
      .catch((info) => {

        setLoadingEdit(false);
      });
  };

  const handleDelete = async (id_instrutor) => {
    try {
      const response = await api.delete(`instrutor/${id_instrutor}`);
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        getData(searchAttribute, searchText);
        Modal.destroyAll();
        message.success("Instrutor excluído com sucesso!");
      }
    } catch (error) {
      if (error.response) message.error(error.response.data.error);
      else
        message.error(
          "Ocorreu um erro na tentativa de cadastro do instrutor, tente novamente."
        );
    }
  };

  const showDeleteConfirm = (id_instrutor, nome) => {
    Modal.confirm({
      title: "Excluir Instrutor",
      content: `Tem certeza que deseja excluir o instrutor ${nome}`,
      okText: "Sim",
      okType: "primary",
      cancelText: "Não",
      onOk() {
        handleDelete(id_instrutor);
      },
      onCancel() {
        Modal.destroyAll();
      },
    });
  };

  return (
    <div className="instrutor-container">
      <Navbar />
      {user && user.id_perfil !== 3 ? (
        <h2 style={{ opacity: "0.5", textAlign: "center" }}>
          Você não possui acesso a essa funcionalidade!
        </h2>
      ) : (
        <>
          <div className="box">
            <h1 className="searchAreaTitle">Buscar Instrutores</h1>
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
                <Select.Option value="id_instrutor">
                  Cód. Instrutor
                </Select.Option>
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
                Novo Instrutor
              </Button>
            </div>
            <Table
              size="small"
              scroll={{ y: 300 }}
              columns={columns}
              dataSource={instrutores}
            />
          </div>
          <Modal
            visible={visibleInsert}
            title="Novo Instrutor"
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
            <Form {...layout} form={formNew} name="new-instrutor">
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
                  placeholder="Nome do Instrutor"
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
                  placeholder="RG do Instrutor"
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
                  placeholder="CPF do Instrutor"
                  maxLength="14"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Atividades"
                name="atividades"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha pelo menos uma Atividade!",
                  },
                ]}
              >
                <Checkbox.Group>
                  {listaAtividades &&
                    listaAtividades.map((item) => (
                      <Row>
                        <Checkbox
                          value={item.id_atividade}
                          style={{ lineHeight: "32px", marginLeft: "6px" }}
                        >
                          {item.descricao}
                        </Checkbox>
                      </Row>
                    ))}
                </Checkbox.Group>
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
                  placeholder="Usuário do Instrutor"
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
                  placeholder="Senha do Instrutor"
                  maxLength="20"
                  size="large"
                />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            visible={visibleEdit}
            title={`Editar Instrutor - ${nome}`}
            destroyOnClose={true}
            onCancel={() => {
              setVisibleEdit(false);
              formEdit.resetFields();
              formEdit.setFieldsValue();
              Modal.destroyAll();
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setVisibleEdit(false);
                  formEdit.resetFields();
                  formEdit.setFieldsValue();
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
            <Form
              {...layout}
              form={formEdit}
              name="edit-instrutor"
              initialValues={{
                atividades: atividades,
              }}
            >
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
                  placeholder="Nome do Instrutor"
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
                  placeholder="RG do Instrutor"
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
                  placeholder="CPF do Instrutor"
                  maxLength="14"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Atividades"
                name="atividades"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha pelo menos uma Atividade!",
                  },
                ]}
              >
                <Checkbox.Group>
                  {listaAtividades &&
                    listaAtividades.map((item) => (
                      <Row>
                        <Checkbox
                          value={item.id_atividade}
                          style={{ lineHeight: "32px", marginLeft: "6px" }}
                        >
                          {item.descricao}
                        </Checkbox>
                      </Row>
                    ))}
                </Checkbox.Group>
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
                  placeholder="Usuário do Instrutor"
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
                  placeholder="Senha do Instrutor"
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
