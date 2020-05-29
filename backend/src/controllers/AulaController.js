const { Op } = require("sequelize");
const Instrutor = require("../models/Instrutor");
const Aula = require("../models/Aula");

module.exports = {
  async store(req, res, next) {
    try {
      const {
        nome,
        horario_inicio,
        horario_termino,
        id_instrutor,
        numero_sala,
        flag_segunda,
        flag_terca,
        flag_quarta,
        flag_quinta,
        flag_sexta,
        flag_sabado,
        flag_domingo,
      } = req.body;

      const instrutor = await Instrutor.findByPk(id_instrutor);
      if (!instrutor)
        return res.status(404).json({ error: "Instrutor não encontrado!" });

      const disponibilidade = async (indicador, valor) => {
        const obj = await Aula.findOne({
          where: {
            [indicador]: valor,
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    [Op.and]: [
                      {
                        horario_inicio: {
                          [Op.gte]: horario_inicio,
                        },
                      },
                      {
                        horario_inicio: {
                          [Op.lt]: horario_termino,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        horario_termino: {
                          [Op.gt]: horario_inicio,
                        },
                      },
                      {
                        horario_termino: {
                          [Op.lte]: horario_termino,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                [Op.or]: [
                  {
                    [Op.and]: [
                      {
                        flag_segunda: flag_segunda,
                      },
                      {
                        flag_segunda: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_terca: flag_terca,
                      },
                      {
                        flag_terca: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_terca: flag_terca,
                      },
                      {
                        flag_terca: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_quarta: flag_quarta,
                      },
                      {
                        flag_quarta: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_quinta: flag_quinta,
                      },
                      {
                        flag_quinta: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_sexta: flag_sexta,
                      },
                      {
                        flag_sexta: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_sabado: flag_sabado,
                      },
                      {
                        flag_sabado: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_domingo: flag_domingo,
                      },
                      {
                        flag_domingo: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        });

        return !obj ? true : false;
      };

      //Verificar disponibilidade instrutor para a aula
      const disponibilidadeInstrutor = await disponibilidade(
        "id_instrutor",
        id_instrutor
      );
      if (!disponibilidadeInstrutor)
        return res.status(404).json({
          error:
            "O instrutor está ministrando uma aula nesse dia da semana e horário",
        });

      //Verificar disponibilidade da sala para a aula
      const disponibilidadeSala = await disponibilidade(
        "numero_sala",
        numero_sala
      );
      if (!disponibilidadeSala)
        return res.status(404).json({
          error: "A sala está ocupada nesse dia da semana e horário",
        });

      const aula = await Aula.create({
        nome,
        horario_inicio,
        horario_termino,
        id_instrutor,
        numero_sala,
        flag_segunda,
        flag_terca,
        flag_quarta,
        flag_quinta,
        flag_sexta,
        flag_sabado,
        flag_domingo,
        data_criacao: new Date(),
        data_alteracao: new Date(),
      });

      return res.json(aula);
    } catch (error) {
      next(error);
    }
  },
  async index(req, res, next) {
    try {
      const { indicador, valor } = req.params;

      if (indicador && valor) {
        const operator =
          indicador.indexOf("numero") !== 0
            ? { [Op.iLike]: "%" + valor + "%" }
            : { [Op.eq]: valor };
        const aulas = await Aula.findAll({
          include: [
            {
              association: "instrutor",
              attributes: ["nome"],
            },
          ],
          where: {
            [indicador]: operator
          },
          order: [["data_alteracao", "DESC"]],
        });
        return res.json(aulas);
      } else {
        const aulas = await Aula.findAll({
          include: [
            {
              association: "instrutor",
              attributes: ["nome"],
            },
          ],
          order: [["data_alteracao", "DESC"]],
        });
        return res.json(aulas);
      }
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const {
        nome,
        horario_inicio,
        horario_termino,
        id_instrutor,
        numero_sala,
        flag_segunda,
        flag_terca,
        flag_quarta,
        flag_quinta,
        flag_sexta,
        flag_sabado,
        flag_domingo,
      } = req.body;

      const { id_aula } = req.params;

      const instrutor = await Instrutor.findByPk(id_instrutor);
      if (!instrutor)
        return res.status(404).json({ error: "Instrutor não encontrado!" });

      const aula = await Aula.findByPk(id_aula);
      if (!aula) return res.status(404).json({ error: "Aula não encontrada!" });

      const disponibilidade = async (indicador, valor) => {
        const obj = await Aula.findOne({
          where: {
            [indicador]: valor,
            id_aula: {
              [Op.ne]: id_aula,
            },
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    [Op.and]: [
                      {
                        horario_inicio: {
                          [Op.gte]: horario_inicio,
                        },
                      },
                      {
                        horario_inicio: {
                          [Op.lt]: horario_termino,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        horario_termino: {
                          [Op.gt]: horario_inicio,
                        },
                      },
                      {
                        horario_termino: {
                          [Op.lte]: horario_termino,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                [Op.or]: [
                  {
                    [Op.and]: [
                      {
                        flag_segunda: flag_segunda,
                      },
                      {
                        flag_segunda: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_terca: flag_terca,
                      },
                      {
                        flag_terca: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_terca: flag_terca,
                      },
                      {
                        flag_terca: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_quarta: flag_quarta,
                      },
                      {
                        flag_quarta: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_quinta: flag_quinta,
                      },
                      {
                        flag_quinta: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_sexta: flag_sexta,
                      },
                      {
                        flag_sexta: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_sabado: flag_sabado,
                      },
                      {
                        flag_sabado: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        flag_domingo: flag_domingo,
                      },
                      {
                        flag_domingo: {
                          [Op.ne]: 0,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        });

        return !obj ? true : false;
      };

      //Verificar disponibilidade instrutor para a aula
      const disponibilidadeInstrutor = await disponibilidade(
        "id_instrutor",
        id_instrutor
      );
      if (!disponibilidadeInstrutor)
        return res.status(404).json({
          error:
            "O instrutor está ministrando uma aula nesse dia da semana e horário",
        });

      //Verificar disponibilidade da sala para a aula
      const disponibilidadeSala = await disponibilidade(
        "numero_sala",
        numero_sala
      );
      if (!disponibilidadeSala)
        return res.status(404).json({
          error: "A sala está ocupada nesse dia da semana e horário",
        });

      const aulaUpdate = await Aula.update(
        {
          nome,
          horario_inicio,
          horario_termino,
          id_instrutor,
          numero_sala,
          flag_segunda,
          flag_terca,
          flag_quarta,
          flag_quinta,
          flag_sexta,
          flag_sabado,
          flag_domingo,
          data_alteracao: new Date(),
        },
        {
          where: {
            id_aula,
          },
        }
      );

      return res.json({
        retorno: aulaUpdate,
        mensagem:
          aulaUpdate == 1
            ? "Atualizado com sucesso!"
            : "Houve um problema na atualização",
      });
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    try {
      const { id_aula } = req.params;

      const aula = await Aula.findByPk(id_aula);
      if (!aula) return res.status(404).json({ error: "Aula não encontrada!" });

      await Aula.destroy({ where: { id_aula } });

      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  },
};
