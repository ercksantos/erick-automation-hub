import { Link } from "react-router-dom";
import { NAV, SITE, waLink } from "@/content/site";
import { EMPRESA } from "@/lib/empresa";
import { NodeMark } from "./NodeMark";

export const Foot = () => (
  <footer className="foot">
    <div className="wrap">
      <div className="foot__grid">
        <div>
          <div className="foot__brand">
            <NodeMark />
            <strong>{SITE.marca}</strong>
          </div>
          <p className="foot__line">
            Agentes de IA no WhatsApp, CRM e sistemas sob medida para pequenas e médias empresas. Construídos por {SITE.pessoa}.
          </p>
        </div>
        <div className="foot__cols">
          <div>
            <h4>No site</h4>
            <ul>
              {NAV.map(({ id, label }) => (
                <li key={id}>
                  <Link to={`/#${id}`}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Fale comigo</h4>
            <ul>
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`}>E-mail</a>
              </li>
              <li>
                <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={SITE.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Documentos</h4>
            <ul>
              <li>
                <Link to="/privacidade">Política de Privacidade</Link>
              </li>
              <li>
                <Link to="/termos">Termos de Uso</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="foot__legal">
        <p>
          {EMPRESA.razaoSocial}, CNPJ {EMPRESA.cnpj}
          <br />
          {EMPRESA.endereco}
        </p>
        <p>
          © {new Date().getFullYear()} {SITE.marca}
        </p>
      </div>
    </div>
  </footer>
);
