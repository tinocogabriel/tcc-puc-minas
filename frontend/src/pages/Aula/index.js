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
  InputNumber,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import "./styles.css";
export default function Aula() {
  const [aulas, setAulas] = useState([]);
  const [instrutores, setInstrutores] = useState([]);

  const [searchAttribute, setSearchAttribute] = useState("nome");
  const [searchText, setSearchText] = useState("");

  const [visibleInsert, setVisibleInsert] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [loadingInsert, setLoadingInsert] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [idAula, setIdAula] = useState("");
  const [idInstrutor, setIdInstrutor] = useState("");
  const [nome, setNome] = useState("");
  const [horarioInicio, setHorarioInicio] = useState(800);
  const [horarioTermino, setHorarioTermino] = useState(900);
  const [numeroSala, setNumeroSala] = useState("");
  const [segunda, setSegunda] = useState(false);
  const [terca, setTerca] = useState(false);
  const [quarta, setQuarta] = useState(false);
  const [quinta, setQuinta] = useState(false);
  const [sexta, setSexta] = useState(false);
  const [sabado, setSabado] = useState(false);
  const [domingo, setDomingo] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getData();
    getInstrutores();
  }, []);

  const getData = async (attribute, text) => {
    const response = await api.get(
      attribute && text ? `aula/${attribute}/${text}` : `aula`
    );
    setAulas(response.data.slice(0, 36));
  };

  const getInstrutores = async () => {
    const response = await api.get(`instrutor`);
    setInstrutores(response.data);
  };

  const columns = [
    {
      title: "Nome da Aula",
      dataIndex: "nome",
      key: "nome",
      width: 100,
    },
    {
      title: "Nome Instrutor",
      dataIndex: ["instrutor", "nome"],
      key: ["instrutor", "nome"],
      width: 200,
    },
    {
      title: "Horário",
      key: "horario_inicio",
      width: 200,
      render: (text, record) => {
        return (
          <span>
            {formatHour(record.horario_inicio)} -{" "}
            {formatHour(record.horario_termino)}
          </span>
        );
      },
    },
    {
      title: "Número Sala",
      dataIndex: "numero_sala",
      key: "numero_sala",
      width: 150,
    },
    {
      title: "Horário",
      key: "horario_inicio",
      width: 200,
      render: (text, record) => {
        const diasSemana = [];
        record.flag_segunda && diasSemana.push("Segunda-Feira");
        record.flag_terca && diasSemana.push("Terça-Feira");
        record.flag_quarta && diasSemana.push("Quarta-Feira");
        record.flag_quinta && diasSemana.push("Quinta-Feira");
        record.flag_sexta && diasSemana.push("Sexta-Feira");
        record.flag_sabado && diasSemana.push("Sabado-Feira");
        record.flag_domingo && diasSemana.push("Domingo-Feira");

        return (
          <Tooltip title={diasSemana.join(",")}>
            <CalendarOutlined />
          </Tooltip>
        );
      },
    },
    {
      title: "Editar",
      key: "editar",
      width: 100,
      render: (text, record) => (
        <EditOutlined
          onClick={() => {
            setIdAula(record.id_aula);
            setIdInstrutor(record.id_instrutor);
            setNome(record.nome);
            setHorarioInicio(record.horario_inicio);
            setHorarioTermino(record.horario_termino);
            setNumeroSala(record.numero_sala);
            setSegunda(record.flag_segunda === 1 ? true : false);
            setTerca(record.flag_terca);
            setQuarta(record.flag_quarta);
            setQuinta(record.flag_quinta);
            setSexta(record.flag_sexta);
            setSabado(record.flag_sabado);
            setDomingo(record.flag_domingo);
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
            showDeleteConfirm(record.id_aula, record.nome);
          }}
        />
      ),
    },
  ];

  const [formNew] = Form.useForm();
  const [formEdit] = Form.useForm();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const handleSave = () => {
    setLoadingInsert(true);
    formNew
      .validateFields()
      .then(
        async ({
          nome,
          horario_inicio,
          horario_termino,
          numero_sala,
          flag_segunda,
          flag_terca,
          flag_quarta,
          flag_quinta,
          flag_sexta,
          flag_sabado,
          flag_domingo,
          id_instrutor,
        }) => {
          try {
            if (
              (flag_segunda ? Number(flag_segunda) : 0) === 0 &&
              (flag_terca ? Number(flag_terca) : 0) === 0 &&
              (flag_quarta ? Number(flag_quarta) : 0) === 0 &&
              (flag_quinta ? Number(flag_quinta) : 0) === 0 &&
              (flag_sexta ? Number(flag_sexta) : 0) === 0 &&
              (flag_sabado ? Number(flag_sabado) : 0) === 0 &&
              (flag_domingo ? Number(flag_domingo) : 0) === 0
            ) {
              message.error("Selecione pelo menos um dia da semana!");
              setLoadingInsert(false);
              return;
            }
            const response = await api.post("aula", {
              nome,
              horario_inicio,
              horario_termino,
              numero_sala,
              flag_segunda: flag_segunda ? Number(flag_segunda) : 0,
              flag_terca: flag_terca ? Number(flag_terca) : 0,
              flag_quarta: flag_quarta ? Number(flag_quarta) : 0,
              flag_quinta: flag_quinta ? Number(flag_quinta) : 0,
              flag_sexta: flag_sexta ? Number(flag_sexta) : 0,
              flag_sabado: flag_sabado ? Number(flag_sabado) : 0,
              flag_domingo: flag_domingo ? Number(flag_domingo) : 0,
              id_instrutor,
            });
            if (response.status === 200 || response.status === 201) {
              getData(searchAttribute, searchText);
              Modal.destroyAll();
              setLoadingInsert(false);
              setVisibleInsert(false);
              message.success("Aula criada com sucesso!");
            }
          } catch (error) {
            if (error.response) message.error(error.response.data.error);
            else
              message.error(
                "Ocorreu um erro na tentativa de cadastro da aula, tente novamente."
              );
            setLoadingInsert(false);
          }
        }
      )
      .catch((info) => {
        setLoadingInsert(false);
      });
  };

  const handleEdit = () => {
    setLoadingEdit(true);
    formEdit
      .validateFields()
      .then(
        async ({
          nome,
          horario_inicio,
          horario_termino,
          numero_sala,
          flag_segunda,
          flag_terca,
          flag_quarta,
          flag_quinta,
          flag_sexta,
          flag_sabado,
          flag_domingo,
          id_instrutor,
        }) => {
          try {
            if (
              (flag_segunda ? Number(flag_segunda) : 0) === 0 &&
              (flag_terca ? Number(flag_terca) : 0) === 0 &&
              (flag_quarta ? Number(flag_quarta) : 0) === 0 &&
              (flag_quinta ? Number(flag_quinta) : 0) === 0 &&
              (flag_sexta ? Number(flag_sexta) : 0) === 0 &&
              (flag_sabado ? Number(flag_sabado) : 0) === 0 &&
              (flag_domingo ? Number(flag_domingo) : 0) === 0
            ) {
              message.error("Selecione pelo menos um dia da semana!");
              setLoadingEdit(false);
              return;
            }
            const response = await api.put(`aula/${idAula}`, {
              nome,
              horario_inicio,
              horario_termino,
              numero_sala,
              flag_segunda: Number(flag_segunda),
              flag_terca: Number(flag_terca),
              flag_quarta: Number(flag_quarta),
              flag_quinta: Number(flag_quinta),
              flag_sexta: Number(flag_sexta),
              flag_sabado: Number(flag_sabado),
              flag_domingo: Number(flag_domingo),
              id_instrutor,
            });
            if (response.status === 200 || response.status === 201) {
              getData(searchAttribute, searchText);
              message.success("Aula atualizada com sucesso!");
              Modal.destroyAll();
              setLoadingEdit(false);
              setVisibleEdit(false);
            }
          } catch (error) {
            if (error.response) message.error(error.response.data.error);
            else
              message.error(
                "Ocorreu um erro na tentativa de atualização do aula, tente novamente."
              );
            setLoadingEdit(false);
          }
        }
      )
      .catch((info) => {
        setLoadingEdit(false);
      });
  };

  const handleDelete = async (id_aula) => {
    try {
      const response = await api.delete(`aula/${id_aula}`);
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        getData(searchAttribute, searchText);
        Modal.destroyAll();
        message.success("Aula excluída com sucesso!");
      }
    } catch (error) {
      if (error.response) message.error(error.response.data.error);
      else
        message.error(
          "Ocorreu um erro na tentativa de cadastro da aula, tente novamente."
        );
    }
  };

  const showDeleteConfirm = (id_aula, nome) => {
    Modal.confirm({
      title: "Excluir Aula",
      content: `Tem certeza que deseja excluir a aula ${nome}`,
      okText: "Sim",
      okType: "primary",
      cancelText: "Não",
      onOk() {
        handleDelete(id_aula);
      },
      onCancel() {
        Modal.destroyAll();
      },
    });
  };

  const formatHour = (hourInteger) => {
    if (hourInteger < 1000)
      return "0" + hourInteger.toString().substring(0, 1) + ":00";
    else return hourInteger.toString().substring(0, 2) + ":00";
  };

  return (
    <div className="aula-container">
      <Navbar />
      {user && user.id_perfil !== 3 ? (
        <h2 style={{ opacity: "0.5", textAlign: "center" }}>
          Você não possui acesso a essa funcionalidade!
        </h2>
      ) : (
        <>
          <div className="box">
            <h1 className="searchAreaTitle">Buscar Aulas</h1>
            <div className="searchArea">
              <Select
                className="searchAttribute"
                value={searchAttribute}
                size="large"
                onChange={(value) => {
                  setSearchAttribute(value);
                }}
              >
                <Select.Option value="numero_sala">
                  Número da Sala
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
                Nova Aula
              </Button>
            </div>
            <Table
              size="small"
              scroll={{ y: 300 }}
              columns={columns}
              dataSource={aulas}
            />
          </div>
          <Modal
            visible={visibleInsert}
            title="Nova Aula"
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
            <Form {...layout} form={formNew} name="new-aula">
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
                  placeholder="Nome da Aula"
                  maxLength="150"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Número da Sala"
                name="numero_sala"
                rules={[
                  {
                    required: true,
                    type: "number",
                    message:
                      "Por favor, preencha o campo número da sala (somente números)!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Número da Sala"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>

              <Form.Item label="Horário">
                <Form.Item
                  name="horario_inicio"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, preencha o campo horário início!",
                    },
                  ]}
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 8px)",
                    marginRight: "10px",
                  }}
                >
                  <Select placeholder="Início" size="large">
                    {[
                      800,
                      900,
                      1000,
                      1100,
                      1200,
                      1300,
                      1400,
                      1500,
                      1600,
                      1700,
                    ].map((hour) => (
                      <Select.Option value={hour}>
                        {formatHour(hour)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="horario_termino"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, preencha o campo horário termino!",
                    },
                  ]}
                  style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                >
                  <Select placeholder="Termino" size="large">
                    {[
                      900,
                      1000,
                      1100,
                      1200,
                      1300,
                      1400,
                      1500,
                      1600,
                      1700,
                      1800,
                    ].map((hour) => (
                      <Select.Option value={hour}>
                        {formatHour(hour)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form.Item>
              <Form.Item
                label="Instrutor"
                name="id_instrutor"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo instrutor!",
                  },
                ]}
              >
                <Select placeholder="Nome do Instrutor" size="large">
                  {instrutores &&
                    instrutores.map((instrutor) => {
                      return (
                        <Select.Option value={instrutor.id_instrutor}>
                          {instrutor.nome}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Dias da Semana"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha pelo menos um dia da semana!",
                  },
                ]}
              >
                <Form.Item name="flag_segunda" valuePropName="checked">
                  <Checkbox>Segunda-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_terca" valuePropName="checked">
                  <Checkbox>Terca-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_quarta" valuePropName="checked">
                  <Checkbox>Quarta-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_quinta" valuePropName="checked">
                  <Checkbox>Quinta-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_sexta" valuePropName="checked">
                  <Checkbox>Sexta-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_sabado" valuePropName="checked">
                  <Checkbox>Sabado</Checkbox>
                </Form.Item>
                <Form.Item name="flag_domingo" valuePropName="checked">
                  <Checkbox>Domingo</Checkbox>
                </Form.Item>
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
            <Form
              {...layout}
              form={formEdit}
              name="edit-aula"
              initialValues={{
                flag_segunda: segunda,
                flag_terca: terca,
                flag_quarta: quarta,
                flag_quinta: quinta,
                flag_sexta: sexta,
                flag_sabado: sabado,
                flag_domingo: domingo,
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
                  placeholder="Nome da Aula"
                  maxLength="150"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label="Número da Sala"
                initialValue={numeroSala}
                name="numero_sala"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo número da sala!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Número da Sala"
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>
              <Form.Item label="Horário">
                <Form.Item
                  name="horario_inicio"
                  initialValue={horarioInicio}
                  rules={[
                    {
                      required: true,
                      message: "Por favor, preencha o campo horário início!",
                    },
                  ]}
                  style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                >
                  <Select size="large" placeholder="Início">
                    {[
                      800,
                      900,
                      1000,
                      1100,
                      1200,
                      1300,
                      1400,
                      1500,
                      1600,
                      1700,
                    ].map((hour) => (
                      <Select.Option value={hour}>
                        {formatHour(hour)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="horario_termino"
                  initialValue={horarioTermino}
                  rules={[
                    {
                      required: true,
                      message: "Por favor, preencha o campo horário termino!",
                    },
                  ]}
                  style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                >
                  <Select size="large" placeholder="Termino">
                    {[
                      900,
                      1000,
                      1100,
                      1200,
                      1300,
                      1400,
                      1500,
                      1600,
                      1700,
                      1800,
                    ].map((hour) => (
                      <Select.Option value={hour}>
                        {formatHour(hour)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form.Item>
              <Form.Item
                label="Instrutor"
                name="id_instrutor"
                initialValue={idInstrutor}
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha o campo instrutor!",
                  },
                ]}
              >
                <Select placeholder="Nome do Instrutor" size="large">
                  {instrutores &&
                    instrutores.map((instrutor) => {
                      return (
                        <Select.Option value={instrutor.id_instrutor}>
                          {instrutor.nome}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Dias da Semana"
                rules={[
                  {
                    required: true,
                    message: "Por favor, preencha pelo menos um dia da semana!",
                  },
                ]}
              >
                <Form.Item name="flag_segunda" valuePropName="checked">
                  <Checkbox>Segunda-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_terca" valuePropName="checked">
                  <Checkbox>Terca-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_quarta" valuePropName="checked">
                  <Checkbox>Quarta-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_quinta" valuePropName="checked">
                  <Checkbox>Quinta-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_sexta" valuePropName="checked">
                  <Checkbox>Sexta-feira</Checkbox>
                </Form.Item>
                <Form.Item name="flag_sabado" valuePropName="checked">
                  <Checkbox>Sabado</Checkbox>
                </Form.Item>
                <Form.Item name="flag_domingo" valuePropName="checked">
                  <Checkbox>Domingo</Checkbox>
                </Form.Item>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
}
