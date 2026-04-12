import type { Lang } from './lang';

type EmailTemplates = {
  pdfFailedNote: string;
  guestAttachmentLine: string;
  guestDear: (name: string) => string;
  guestThanks: (property: string) => string;
  /** Property name already escaped for HTML. */
  guestThanksHtml: (propertyNameEscaped: string) => string;
  guestLookForward: string;
  guestBestRegards: (property: string) => string;
  guestHtmlAttachment: string;
  guestSubject: (property: string) => string;
  adminSubject: (guest: string, property: string) => string;
  adminBodyIntro: string;
  adminAttachment: string;
  adminProperty: string;
  adminGuest: string;
  adminEmailLabel: string;
  adminDates: string;
  adminNotProvided: string;
  sameSubject: (guest: string, property: string) => string;
  sameAdminSeparator: string;
  sameAdminCopyHtml: string;
};

const templates: Record<Lang, EmailTemplates> = {
  EN: {
    pdfFailedNote:
      'The PDF could not be generated. Your registration was saved.',
    guestAttachmentLine:
      '\n\nPlease find attached a copy of your signed agreement for your records.',
    guestDear: (name) => `Dear ${name},`,
    guestThanks: (property) =>
      `Thank you for completing your pre-check-in for ${property}.`,
    guestThanksHtml: (propertyNameEscaped) =>
      `Thank you for completing your pre-check-in for <strong>${propertyNameEscaped}</strong>.`,
    guestLookForward: 'We look forward to welcoming you soon!',
    guestBestRegards: (property) =>
      `Best regards,\n${property} Management`,
    guestHtmlAttachment:
      'Please find <strong>your copy of the signed agreement</strong> attached to this email.',
    guestSubject: (property) =>
      `Your check-in confirmation — ${property}`,
    adminSubject: (guest, property) =>
      `New registration: ${guest} — ${property}`,
    adminBodyIntro: 'A new guest registration has been completed.',
    adminAttachment: 'The signed agreement is attached.',
    adminProperty: 'Property:',
    adminGuest: 'Guest:',
    adminEmailLabel: 'Email:',
    adminDates: 'Dates:',
    adminNotProvided: '(not provided)',
    sameSubject: (guest, property) =>
      `Check-in: ${guest} — ${property}`,
    sameAdminSeparator: '\n\n--- Admin copy ---\n',
    sameAdminCopyHtml: 'Admin copy',
  },
  FR: {
    pdfFailedNote:
      'Le PDF n’a pas pu être généré. Votre enregistrement a bien été enregistré.',
    guestAttachmentLine:
      '\n\nVous trouverez en pièce jointe une copie de votre accord signé pour vos archives.',
    guestDear: (name) => `Bonjour ${name},`,
    guestThanks: (property) =>
      `Merci d’avoir complété votre pré-enregistrement pour ${property}.`,
    guestThanksHtml: (propertyNameEscaped) =>
      `Merci d’avoir complété votre pré-enregistrement pour <strong>${propertyNameEscaped}</strong>.`,
    guestLookForward: 'Au plaisir de vous accueillir bientôt !',
    guestBestRegards: (property) =>
      `Cordialement,\n${property}`,
    guestHtmlAttachment:
      'Vous trouverez <strong>votre copie de l’accord signé</strong> en pièce jointe à cet e-mail.',
    guestSubject: (property) =>
      `Confirmation de pré-enregistrement — ${property}`,
    adminSubject: (guest, property) =>
      `Nouvelle inscription : ${guest} — ${property}`,
    adminBodyIntro: 'Une nouvelle inscription d’invité a été enregistrée.',
    adminAttachment: 'L’accord signé est en pièce jointe.',
    adminProperty: 'Établissement :',
    adminGuest: 'Invité :',
    adminEmailLabel: 'E-mail :',
    adminDates: 'Dates :',
    adminNotProvided: '(non fourni)',
    sameSubject: (guest, property) =>
      `Pré-enregistrement : ${guest} — ${property}`,
    sameAdminSeparator: '\n\n--- Copie administration ---\n',
    sameAdminCopyHtml: 'Copie administration',
  },
  SP: {
    pdfFailedNote:
      'No se pudo generar el PDF. Su registro se ha guardado correctamente.',
    guestAttachmentLine:
      '\n\nAdjunto encontrará una copia de su acuerdo firmado para sus archivos.',
    guestDear: (name) => `Estimado/a ${name},`,
    guestThanks: (property) =>
      `Gracias por completar su pre-registro para ${property}.`,
    guestThanksHtml: (propertyNameEscaped) =>
      `Gracias por completar su pre-registro para <strong>${propertyNameEscaped}</strong>.`,
    guestLookForward: '¡Esperamos darle la bienvenida pronto!',
    guestBestRegards: (property) =>
      `Saludos cordiales,\n${property}`,
    guestHtmlAttachment:
      'Adjunto encontrará <strong>su copia del acuerdo firmado</strong> en este correo.',
    guestSubject: (property) =>
      `Confirmación de pre-registro — ${property}`,
    adminSubject: (guest, property) =>
      `Nuevo registro: ${guest} — ${property}`,
    adminBodyIntro: 'Se ha completado un nuevo registro de huésped.',
    adminAttachment: 'El acuerdo firmado se adjunta.',
    adminProperty: 'Propiedad:',
    adminGuest: 'Huésped:',
    adminEmailLabel: 'Correo:',
    adminDates: 'Fechas:',
    adminNotProvided: '(no indicado)',
    sameSubject: (guest, property) =>
      `Pre-registro: ${guest} — ${property}`,
    sameAdminSeparator: '\n\n--- Copia administración ---\n',
    sameAdminCopyHtml: 'Copia administración',
  },
};

export function getCheckinEmailTemplates(lang: Lang): EmailTemplates {
  return templates[lang] ?? templates.EN;
}
