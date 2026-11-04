import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar } from "@/components/site/Bar";
import { Foot } from "@/components/site/Foot";

const NotFound = () => {
  useEffect(() => {
    document.title = "Página não encontrada | Erick.AI";
  }, []);

  return (
    <>
      <Bar />
      <main className="page" id="conteudo">
        <div className="page__in">
          <h1 className="page__title">Essa página não existe.</h1>
          <p className="page__date">O endereço pode ter mudado ou ter sido digitado errado.</p>
          <Link className="btn btn--amber" to="/">
            Voltar para o início
          </Link>
        </div>
      </main>
      <Foot />
    </>
  );
};

export default NotFound;
