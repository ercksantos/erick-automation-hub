import { SECOES } from "@/content/site";

// Selo da seção, como o nome de um nó num fluxo: número, nome e o estado da execução.
// O estado (aguardando, rodando, ok) é trocado pelo Spine conforme a rolagem chega.
export const SecTag = ({ id }: { id: string }) => {
  const i = SECOES.findIndex((s) => s.id === id);
  return (
    <p className="tag" data-tag={id} aria-hidden="true">
      <span className="tag__node" />
      <span className="tag__n">{String(i + 1).padStart(2, "0")}</span>
      <span className="tag__name">{SECOES[i]?.nome ?? id}</span>
      <span className="tag__st">
        <i />
        <span className="tag__txt">aguardando</span>
      </span>
    </p>
  );
};
