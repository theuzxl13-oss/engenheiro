"use client";

import {
  saveCertification,
  saveProfile,
  saveProject,
  saveService,
  saveTestimonial,
  updateQuote,
} from "@/app/admin/actions";
import { SERVICE_ICON_OPTIONS } from "./icon-names";
import { CERTIFICATION_KINDS, QUOTE_STATUSES } from "@/lib/types";
import type { Certification, Profile, Project, QuoteRequest, Service, Testimonial } from "@/lib/types";
import { AdminForm, Checkbox, Fieldset, SelectField, TextArea, TextField } from "./form-kit";
import { GalleryField, UploadField } from "./upload-field";

export function ProfileForm({ profile }: { profile: Profile }) {
  return (
    <AdminForm action={saveProfile} submitLabel="Salvar perfil">
      {(e) => (
        <>
          <Fieldset legend="Dados profissionais">
            <TextField name="full_name" label="Nome completo" defaultValue={profile.full_name} error={e.full_name} required />
            <TextField name="headline" label="Especialidade" defaultValue={profile.headline} error={e.headline} hint="Ex.: Engenheiro Civil" required />
            <TextField name="crea" label="Registro CREA" defaultValue={profile.crea} error={e.crea} placeholder="CREA-SP 0000000000" />
            <TextField name="years_experience" label="Anos de experiência" type="number" defaultValue={profile.years_experience} error={e.years_experience} />
            <TextArea name="bio" label="Biografia" rows={6} defaultValue={profile.bio} error={e.bio} hint="Separe parágrafos com uma linha em branco." className="sm:col-span-2" />
            <TextArea name="areas" label="Áreas de atuação (especialidades)" defaultValue={profile.areas.join("\n")} error={e.areas} hint="Uma por linha." />
            <TextArea name="courses" label="Cursos e especializações" defaultValue={profile.courses.join("\n")} error={e.courses} hint="Um por linha." />
          </Fieldset>

          <Fieldset legend="Formação acadêmica">
            <TextField name="degree" label="Formação" defaultValue={profile.degree} error={e.degree} placeholder="Bacharelado em Engenharia Civil" />
            <TextField name="institution" label="Instituição de ensino" defaultValue={profile.institution} error={e.institution} />
            <TextField name="graduation_year" label="Ano de conclusão" type="number" defaultValue={profile.graduation_year} error={e.graduation_year} />
          </Fieldset>

          <Fieldset legend="Indicadores" description="Preencha somente com dados reais e verificáveis. Campos vazios não são exibidos no site.">
            <TextField name="stat_projects" label="Projetos realizados" type="number" defaultValue={profile.stat_projects} error={e.stat_projects} />
            <TextField name="stat_clients" label="Clientes atendidos" type="number" defaultValue={profile.stat_clients} error={e.stat_clients} />
            <TextField name="stat_certifications" label="Certificações" type="number" defaultValue={profile.stat_certifications} error={e.stat_certifications} />
          </Fieldset>

          <Fieldset legend="Contato e redes sociais">
            <TextField name="email" label="E-mail profissional" type="email" defaultValue={profile.email} error={e.email} />
            <TextField name="phone" label="Telefone" defaultValue={profile.phone} error={e.phone} placeholder="(11) 99999-9999" />
            <TextField name="whatsapp" label="WhatsApp" defaultValue={profile.whatsapp} error={e.whatsapp} hint="Somente números com DDI e DDD. Ex.: 5511999999999" />
            <TextField name="whatsapp_message" label="Mensagem inicial do WhatsApp" defaultValue={profile.whatsapp_message} error={e.whatsapp_message} />
            <TextField name="linkedin_url" label="LinkedIn (URL)" defaultValue={profile.linkedin_url} error={e.linkedin_url} />
            <TextField name="instagram_url" label="Instagram (URL)" defaultValue={profile.instagram_url} error={e.instagram_url} />
            <TextField name="service_area" label="Localização / região de atendimento" defaultValue={profile.service_area} error={e.service_area} className="sm:col-span-2" />
          </Fieldset>

          <Fieldset legend="Imagens e documentos">
            <UploadField name="photo_url" label="Fotografia profissional" folder="perfil" defaultValue={profile.photo_url} error={e.photo_url} hint="Proporção 4:5 recomendada." />
            <UploadField name="hero_image_url" label="Imagem de destaque (página inicial)" folder="perfil" defaultValue={profile.hero_image_url} error={e.hero_image_url} hint="Opcional. Horizontal, mínimo 1920 px." />
            <UploadField name="cv_url" label="Currículo em PDF" kind="pdf" folder="curriculo" defaultValue={profile.cv_url} error={e.cv_url} />
          </Fieldset>
        </>
      )}
    </AdminForm>
  );
}

export function ServiceForm({ service }: { service?: Service }) {
  return (
    <AdminForm action={saveService} submitLabel={service ? "Salvar serviço" : "Cadastrar serviço"} resetOnSuccess={!service}>
      {(e) => (
        <div className="grid gap-5 sm:grid-cols-2">
          {service && <input type="hidden" name="id" value={service.id} />}
          <TextField name="title" label="Nome do serviço" defaultValue={service?.title} error={e.title} required />
          <SelectField
            name="icon"
            label="Ícone"
            defaultValue={service?.icon ?? "ClipboardCheck"}
            options={[...SERVICE_ICON_OPTIONS]}
          />
          <TextArea name="description" label="Descrição" defaultValue={service?.description} error={e.description} className="sm:col-span-2" />
          <UploadField name="image_url" label="Imagem (opcional)" folder="servicos" defaultValue={service?.image_url} error={e.image_url} />
          <div className="space-y-4">
            <TextField name="sort_order" label="Ordem de exibição" type="number" defaultValue={service?.sort_order ?? 0} error={e.sort_order} />
            <Checkbox name="published" label="Publicado no site" defaultChecked={service?.published ?? true} />
          </div>
        </div>
      )}
    </AdminForm>
  );
}

export function ProjectForm({ project }: { project?: Project }) {
  return (
    <AdminForm action={saveProject} submitLabel={project ? "Salvar projeto" : "Cadastrar projeto"}>
      {(e) => (
        <>
          {project && <input type="hidden" name="id" value={project.id} />}
          <Fieldset legend="Identificação">
            <TextField name="title" label="Nome do projeto" defaultValue={project?.title} error={e.title} required />
            <TextField name="slug" label="Endereço (slug)" defaultValue={project?.slug} error={e.slug} hint="Gerado a partir do nome se ficar em branco." />
            <TextField name="category" label="Categoria" defaultValue={project?.category} error={e.category} hint="Usada nos filtros. Ex.: Edificações" required />
            <TextField name="location" label="Localização" defaultValue={project?.location} error={e.location} />
            <TextField name="year" label="Ano de execução" type="number" defaultValue={project?.year} error={e.year} />
            <TextField name="sort_order" label="Ordem de exibição" type="number" defaultValue={project?.sort_order ?? 0} error={e.sort_order} />
            <div className="flex flex-wrap gap-6 sm:col-span-2">
              <Checkbox name="published" label="Publicado no site" defaultChecked={project?.published ?? true} />
              <Checkbox name="featured" label="Destaque (aparece primeiro)" defaultChecked={project?.featured ?? false} />
            </div>
          </Fieldset>

          <Fieldset legend="Conteúdo">
            <TextArea name="summary" label="Resumo (cartão e SEO)" rows={2} defaultValue={project?.summary} error={e.summary} className="sm:col-span-2" />
            <TextArea name="description" label="Descrição" rows={6} defaultValue={project?.description} error={e.description} className="sm:col-span-2" />
            <TextArea name="challenges" label="Desafios encontrados" rows={4} defaultValue={project?.challenges} error={e.challenges} />
            <TextArea name="solutions" label="Soluções desenvolvidas" rows={4} defaultValue={project?.solutions} error={e.solutions} />
            <TextArea name="results" label="Resultados alcançados" rows={4} defaultValue={project?.results} error={e.results} className="sm:col-span-2" />
          </Fieldset>

          <Fieldset legend="Imagens">
            <UploadField name="cover_url" label="Fotografia principal" folder="projetos" defaultValue={project?.cover_url} error={e.cover_url} />
            <div />
            <GalleryField name="gallery" folder="projetos" defaultValue={project?.gallery} />
          </Fieldset>
        </>
      )}
    </AdminForm>
  );
}

export function CertificationForm({ item }: { item?: Certification }) {
  return (
    <AdminForm action={saveCertification} submitLabel={item ? "Salvar" : "Adicionar"} resetOnSuccess={!item}>
      {(e) => (
        <div className="grid gap-5 sm:grid-cols-2">
          {item && <input type="hidden" name="id" value={item.id} />}
          <TextField name="title" label="Título" defaultValue={item?.title} error={e.title} required />
          <SelectField
            name="kind"
            label="Tipo"
            defaultValue={item?.kind ?? "certificado"}
            options={Object.entries(CERTIFICATION_KINDS).map(([value, label]) => ({ value, label }))}
          />
          <TextField name="issuer" label="Instituição / emissor" defaultValue={item?.issuer} error={e.issuer} />
          <TextField name="year" label="Ano" type="number" defaultValue={item?.year} error={e.year} />
          <TextArea name="description" label="Descrição (opcional)" rows={2} defaultValue={item?.description} error={e.description} className="sm:col-span-2" />
          <UploadField name="file_url" label="Documento em PDF (opcional)" kind="pdf" folder="certificados" defaultValue={item?.file_url} error={e.file_url} />
          <div className="space-y-4">
            <TextField name="sort_order" label="Ordem de exibição" type="number" defaultValue={item?.sort_order ?? 0} error={e.sort_order} />
            <Checkbox name="published" label="Publicado no site" defaultChecked={item?.published ?? true} />
          </div>
        </div>
      )}
    </AdminForm>
  );
}

export function TestimonialForm({ item }: { item?: Testimonial }) {
  return (
    <AdminForm action={saveTestimonial} submitLabel={item ? "Salvar" : "Adicionar depoimento"} resetOnSuccess={!item}>
      {(e) => (
        <div className="grid gap-5 sm:grid-cols-2">
          {item && <input type="hidden" name="id" value={item.id} />}
          <TextField name="client_name" label="Nome do cliente" defaultValue={item?.client_name} error={e.client_name} required />
          <TextField name="company" label="Empresa" defaultValue={item?.company} error={e.company} />
          <TextArea name="comment" label="Comentário" rows={4} defaultValue={item?.comment} error={e.comment} className="sm:col-span-2" />
          <SelectField
            name="rating"
            label="Avaliação"
            defaultValue={item?.rating ? String(item.rating) : ""}
            options={[{ value: "", label: "Sem avaliação" }, ...[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} estrela${n > 1 ? "s" : ""}` }))]}
          />
          <TextField name="sort_order" label="Ordem de exibição" type="number" defaultValue={item?.sort_order ?? 0} error={e.sort_order} />
          <UploadField name="photo_url" label="Fotografia (opcional)" folder="depoimentos" defaultValue={item?.photo_url} error={e.photo_url} />
          <div className="flex items-end">
            <Checkbox name="published" label="Publicado no site" defaultChecked={item?.published ?? true} />
          </div>
        </div>
      )}
    </AdminForm>
  );
}

export function QuoteForm({ quote }: { quote: QuoteRequest }) {
  return (
    <AdminForm action={updateQuote} submitLabel="Atualizar">
      {(e) => (
        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          <input type="hidden" name="id" value={quote.id} />
          <SelectField
            name="status"
            label="Situação"
            defaultValue={quote.status}
            options={Object.entries(QUOTE_STATUSES).map(([value, label]) => ({ value, label }))}
          />
          <TextArea name="notes" label="Anotações internas" rows={2} defaultValue={quote.notes} error={e.notes} />
        </div>
      )}
    </AdminForm>
  );
}
