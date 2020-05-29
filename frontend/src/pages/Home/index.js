import React from "react";

import Navbar from "../Navbar/Navbar";
import "./styles.css";

export default function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="box">
        <h2>
          Bem vindo(a) à nova ferramenta da MUSCLE'S GYM, agora que você já
          acessou basta navegar pelas opções do menu!
        </h2>
        <h3>
          Por enquanto, desenvolvemos apenas os módulos de gestão de Clientes,
          Instrutores e Aulas.
        </h3>
      </div>
    </div>
  );
}
