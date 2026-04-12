"use client";
import { useState, useRef, useEffect, useMemo, useCallback, type CSSProperties } from "react";
import Link from 'next/link';
import SignaturePad from 'react-signature-canvas';
import { saveBooking } from '../actions';
import { parseWhatsAppForCheckin, regionDisplayName } from '@/lib/infer-document-country-from-phone';
import { resolveHouseRulesForLang } from '@/lib/house-rules';
import type { Lang } from '@/lib/lang';
import { getPrivacyPolicyHtml } from '@/lib/privacy-policy-html';
import DatePicker from './DatePicker';
import CameraCapture from './CameraCapture';

const TRANSLATIONS = {
  EN: {
    title: "Pre-check-in",
    processing: "Processing your submission...",
    pleaseWait: "Please wait while we process your documents and generate your PDF.",
    personalInfo: "Personal Information",
    fullName: "Full name",
    fullNamePlaceholder: "Enter your full name",
    email: "Email",
    emailPlaceholder: "Enter your email",
    whatsapp: "WhatsApp Number",
    whatsappPlaceholder: "e.g. +212 612345678",
    checkinDates: "Check-in & Check-out dates",
    numTravelers: "Number of Travelers",
    adults: "Adults",
    kids: "Kids (under 18)",
    totalTravelers: "Total travelers:",
    docInfo: "Document Information",
    traveler: "Traveler",
    adult: "Adult",
    kid: "Kid",
    countryOfIssue: "Country of document issue",
    selectCountry: "Select country",
    morocco: "Morocco",
    otherCountry: "Other country",
    noCIN: "Je n'ai pas de CIN / I don't have a CIN",
    cinFront: "CIN recto (front)",
    cinBack: "CIN verso (back)",
    cinNumber: "CIN number",
    passportPhoto: "Passport photo page",
    passportNumber: "Passport number",
    verification: "Verification",
    faceSelfie: "Face selfie (for verification)",
    houseRulesTitle: "House Rules",
    houseRulesFallback:
      "No detailed rules list is set for this property. Please be respectful of the accommodation and neighbors.",
    readHouseRules: "Read House Rules",
    houseRulesAgreement: "I agree to the house rules",
    mustAgree: "You must agree to the house rules to proceed.",
    close: "Close",
    estimatedArrival: "Estimated arrival time",
    selectArrivalPlaceholder: "Select arrival time",
    privacyTitle: "How we use your data",
    privacyEmail: "Email: For booking confirmation and communication.",
    privacyID: "Identity Documents: Legal requirement for police reporting.",
    privacySelfie: "Document photos: Used only for legal registration.",
    privacyArrival: "Arrival Time: To ensure the host is ready for you.",
    signatureTitle: "Signature",
    tapToStart: "Tap the box below to start signing",
    clearSignature: "Clear signature",
    submit: "Submit",
    processingBtn: "Processing...",
    privacyAgreement: "I agree to the privacy policy",
    privacyReadMore: "Privacy Policy",
    errPrivacyRequired: "You must agree to the privacy policy",
    provideSignature: "Please provide a signature before submitting.",
    invalidSignature: "Invalid signature. Please sign again.",
    errorOccurred: "An error occurred. Please try again.",
    submissionNetworkError:
      "We could not reach the server. Check your connection and try again. If you are in the app browser, open the link in Safari or Chrome.",
    clickToSign: "Click to sign",
    doneSigning: "Done signing",
    takeSelfie: "Take Selfie with Camera",
    takeDocument: "Take Document Photo",
    uploadFromDevice: "Or Upload Photo from Device",
    confirmPhoto: "Confirm your photo",
    retake: "Retake",
    usePhoto: "Use this photo",
    successfullyCaptured: "Successfully Captured",
    errNameRequired: "Full name is required",
    errCountryRequired: "Country of document is required",
    errEmailRequired: "Email is required",
    errCheckinRequired: "Check-in date is required",
    errCheckoutRequired: "Check-out date is required",
    errArrivalRequired: "Arrival hour is required",
    errIdNumberRequired: "ID/Passport number is required",
    errPassportRequired: "Passport photo is required",
    errCinFrontRequired: "CIN Front is required",
    errCinBackRequired: "CIN Back is required",
    errSelfieRequired: "Selfie verification is required",
    errAgreementRequired: "You must agree to the house rules",
    errSignatureRequired: "Signature is required",
    errPleaseCheck: "Please check the required fields",
    errMoreFields: "And {n} more fields...",
    continue: "Continue",
    back: "Back",
    docCameraTitleCinFront: "Moroccan national ID (CIN) — front",
    docCameraTitleCinBack: "Moroccan national ID (CIN) — back",
    docCameraTitlePassport: "Passport — photo page",
    docGuidePassport:
      "Fit the passport photo page in the frame — all corners visible, no glare. Use the back camera in good light.",
    docGuidePassportMaNoCin:
      "You chose passport instead of CIN — photograph the main photo page with your details and MRZ lines visible if possible.",
    docGuideCinFront:
      "Lay the front of your CIN flat in the frame — full card visible, text readable, no glare. Use the back camera.",
    docGuideCinBack:
      "Turn the card over and capture the back in the frame — chip side if visible. Keep the card flat.",
    docFramePassport: "Photo page",
    docFrameCinFront: "Front",
    docFrameCinBack: "Back",
    docNoCinPassportGuide:
      "The steps below switch to a passport photo — use the framing guide for the passport page.",
  },
  FR: {
    title: "Pré-enregistrement",
    processing: "Traitement de votre soumission...",
    pleaseWait: "Veuillez patienter pendant le traitement de vos documents...",
    personalInfo: "Informations personnelles",
    fullName: "Nom complet",
    fullNamePlaceholder: "Entrez votre nom complet",
    email: "E-mail",
    emailPlaceholder: "Entrez votre e-mail",
    whatsapp: "Numéro WhatsApp",
    whatsappPlaceholder: "ex: +212 6 12 34 56 78",
    checkinDates: "Dates d'arrivée et de départ",
    numTravelers: "Nombre de voyageurs",
    adults: "Adultes",
    kids: "Enfants (moins de 18 ans)",
    totalTravelers: "Total des voyageurs:",
    docInfo: "Informations sur les documents",
    traveler: "Voyageur",
    adult: "Adulte",
    kid: "Enfant",
    countryOfIssue: "Pays de délivrance",
    selectCountry: "Sélectionnez le pays",
    morocco: "Maroc",
    otherCountry: "Autre pays",
    noCIN: "Je n'ai pas de CIN / I don't have a CIN",
    cinFront: "CIN recto",
    cinBack: "CIN verso",
    cinNumber: "Numéro de CIN",
    passportPhoto: "Page photo du passeport",
    passportNumber: "Numéro de passeport",
    verification: "Vérification",
    faceSelfie: "Selfie (pour vérification)",
    houseRulesTitle: "Règlement intérieur",
    houseRulesFallback:
      "Aucune liste détaillée n’est définie pour ce logement. Merci de respecter le lieu et le voisinage.",
    readHouseRules: "Lire le règlement intérieur",
    houseRulesAgreement: "J'accepte le règlement intérieur",
    mustAgree: "Vous devez accepter le règlement intérieur pour continuer.",
    close: "Fermer",
    estimatedArrival: "Heure d'arrivée prévue",
    selectArrivalPlaceholder: "Choisir l'heure d'arrivée",
    privacyTitle: "Utilisation de vos données",
    privacyEmail: "E-mail : Pour la confirmation et la communication.",
    privacyID: "Documents d'identité : Obligation légale (déclaration police).",
    privacySelfie: "Photos des documents : uniquement pour l'enregistrement légal.",
    privacyArrival: "Heure d'arrivée : Pour organiser votre accueil.",
    signatureTitle: "Signature",
    tapToStart: "Appuyez sur la case ci-dessous pour signer",
    clearSignature: "Effacer la signature",
    submit: "Soumettre",
    processingBtn: "Traitement en cours...",
    privacyAgreement: "J'accepte la politique de confidentialité",
    privacyReadMore: "Politique de confidentialité",
    errPrivacyRequired: "Vous devez accepter la politique de confidentialité",
    provideSignature: "Veuillez fournir une signature avant de soumettre.",
    invalidSignature: "Signature invalide. Veuillez réessayer.",
    errorOccurred: "Une erreur s'est produite. Veuillez réessayer.",
    submissionNetworkError:
      "Impossible de joindre le serveur. Vérifiez la connexion et réessayez. Dans le navigateur intégré d'une application, ouvrez le lien dans Safari ou Chrome.",
    clickToSign: "Cliquez pour signer",
    doneSigning: "Terminer",
    takeSelfie: "Prendre un selfie",
    takeDocument: "Prendre une photo du document",
    uploadFromDevice: "Ou télécharger depuis l'appareil",
    confirmPhoto: "Confirmez votre photo",
    retake: "Recommencer",
    usePhoto: "Utiliser cette photo",
    successfullyCaptured: "Capturé avec succès",
    errNameRequired: "Le nom complet est requis",
    errCountryRequired: "Le pays du document est requis",
    errEmailRequired: "L'e-mail est requis",
    errCheckinRequired: "La date d'arrivée est requise",
    errCheckoutRequired: "La date de départ est requise",
    errArrivalRequired: "L'heure d'arrivée est requise",
    errIdNumberRequired: "Le numéro d'identité/passeport est requis",
    errPassportRequired: "La photo du passeport est requise",
    errCinFrontRequired: "Le recto de la CIN est requis",
    errCinBackRequired: "Le verso de la CIN est requis",
    errSelfieRequired: "Le selfie de vérification est requis",
    errAgreementRequired: "Vous devez accepter le règlement intérieur",
    errSignatureRequired: "La signature est requise",
    errPleaseCheck: "Veuillez vérifier les champs obligatoires",
    errMoreFields: "Et {n} autres champs...",
    continue: "Continuer",
    back: "Retour",
    docCameraTitleCinFront: "CIN marocaine — recto",
    docCameraTitleCinBack: "CIN marocaine — verso",
    docCameraTitlePassport: "Passeport — page photo",
    docGuidePassport:
      "Cadrez la page photo du passeport — quatre coins visibles, sans reflet. Caméra arrière, bonne lumière.",
    docGuidePassportMaNoCin:
      "Vous avez choisi le passeport à la place de la CIN — photographiez la page principale avec vos informations, lignes MRZ visibles si possible.",
    docGuideCinFront:
      "Posez le recto de la CIN à plat dans le cadre — carte entière, texte lisible, sans reflet. Caméra arrière.",
    docGuideCinBack:
      "Retournez la carte et capturez le verso — côté puce si visible. Gardez la carte bien à plat.",
    docFramePassport: "Page photo",
    docFrameCinFront: "Recto",
    docFrameCinBack: "Verso",
    docNoCinPassportGuide:
      "Les étapes ci-dessous passent à une photo de passeport — suivez le guide pour la page du passeport.",
  },
  SP: {
    title: "Pre-registro",
    processing: "Procesando su solicitud...",
    pleaseWait: "Por favor espere mientras procesamos sus documentos...",
    personalInfo: "Información personal",
    fullName: "Nombre completo",
    fullNamePlaceholder: "Ingrese su nombre completo",
    email: "Correo electrónico",
    emailPlaceholder: "Ingrese su correo",
    whatsapp: "Número de WhatsApp",
    whatsappPlaceholder: "ej: +212 612 345 678",
    checkinDates: "Fechas de entrada y salida",
    numTravelers: "Número de viajeros",
    adults: "Adultos",
    kids: "Niños (menores de 18)",
    totalTravelers: "Total de viajeros:",
    docInfo: "Información de documentos",
    traveler: "Viajero",
    adult: "Adulto",
    kid: "Niño",
    countryOfIssue: "País de emisión del documento",
    selectCountry: "Seleccione país",
    morocco: "Marruecos",
    otherCountry: "Otro país",
    noCIN: "No tengo CIN / I don't have a CIN",
    cinFront: "CIN anverso",
    cinBack: "CIN reverso",
    cinNumber: "Número de CIN",
    passportPhoto: "Página de la foto del pasaporte",
    passportNumber: "Número de pasaporte",
    verification: "Verificación",
    faceSelfie: "Selfie (para verificación)",
    houseRulesTitle: "Reglamento interno",
    houseRulesFallback:
      "No hay una lista detallada para este alojamiento. Respete el alojamiento y el vecindario.",
    readHouseRules: "Leer reglamento interno",
    houseRulesAgreement: "Acepto el reglamento interno",
    mustAgree: "Debe aceptar el reglamento interno para continuar.",
    close: "Cerrar",
    estimatedArrival: "Hora estimada de llegada",
    selectArrivalPlaceholder: "Seleccione la hora de llegada",
    privacyTitle: "Uso de sus datos",
    privacyEmail: "Correo: Para confirmación y comunicación.",
    privacyID: "Documentos: Requisito legal para informe policial.",
    privacySelfie: "Fotos del documento: solo para registro legal.",
    privacyArrival: "Hora de llegada: Para asegurar su recepción.",
    signatureTitle: "Firma",
    tapToStart: "Toque el cuadro de abajo para firmar",
    clearSignature: "Borrar firma",
    submit: "Enviar",
    processingBtn: "Procesando...",
    privacyAgreement: "Acepto la política de privacidad",
    privacyReadMore: "Política de privacidad",
    errPrivacyRequired: "Debe aceptar la política de privacidad",
    provideSignature: "Por favor proporcione una firma antes de enviar.",
    invalidSignature: "Firma inválida. Por favor firme de nuevo.",
    errorOccurred: "Ocurrió un error. Por favor intente de nuevo.",
    submissionNetworkError:
      "No se pudo conectar con el servidor. Compruebe la conexión e inténtelo de nuevo. Si usa el navegador dentro de una app, abra el enlace en Safari o Chrome.",
    clickToSign: "Haga clic para firmar",
    doneSigning: "Finalizar",
    takeSelfie: "Tomar selfie con la cámara",
    takeDocument: "Tomar foto del documento",
    uploadFromDevice: "O subir foto desde el dispositivo",
    confirmPhoto: "Confirma tu foto",
    retake: "Reintentar",
    usePhoto: "Usar esta foto",
    successfullyCaptured: "Capturado con éxito",
    errNameRequired: "El nombre completo es obligatorio",
    errCountryRequired: "El país del documento es obligatorio",
    errEmailRequired: "El correo electrónico es obligatorio",
    errCheckinRequired: "La fecha de entrada es obligatoria",
    errCheckoutRequired: "La fecha de salida es obligatoria",
    errArrivalRequired: "la hora de llegada es obligatoria",
    errIdNumberRequired: "El número de identificación/pasaporte es obligatorio",
    errPassportRequired: "La foto del pasaporte es obligatoria",
    errCinFrontRequired: "El anverso del CIN es obligatorio",
    errCinBackRequired: "El reverso del CIN es obligatorio",
    errSelfieRequired: "El selfie de verificación es obligatorio",
    errAgreementRequired: "Debe aceptar las reglas de la casa",
    errSignatureRequired: "La firma es obligatoria",
    errPleaseCheck: "Por favor verifique los campos obligatorios",
    errMoreFields: "Y {n} campos más...",
    continue: "Continuar",
    back: "Atrás",
    docCameraTitleCinFront: "CIN marroquí — anverso",
    docCameraTitleCinBack: "CIN marroquí — reverso",
    docCameraTitlePassport: "Pasaporte — página de la foto",
    docGuidePassport:
      "Encuadre la página con la foto del pasaporte — esquinas visibles, sin reflejos. Cámara trasera y buena luz.",
    docGuidePassportMaNoCin:
      "Eligió pasaporte en lugar de CIN — fotografíe la página principal con sus datos; líneas MRZ visibles si es posible.",
    docGuideCinFront:
      "Coloque el anverso de la CIN plano en el marco — tarjeta completa, texto legible, sin reflejos. Cámara trasera.",
    docGuideCinBack:
      "Gire la tarjeta y capture el reverso — lado del chip si se ve. Mantenga la tarjeta plana.",
    docFramePassport: "Página foto",
    docFrameCinFront: "Anverso",
    docFrameCinBack: "Reverso",
    docNoCinPassportGuide:
      "Los pasos de abajo usan la guía de pasaporte — siga el encuadre de la página del pasaporte.",
  }
};

/** 30-minute slots for arrival (value format HH:MM for server + PDF). */
const ARRIVAL_SLOT_VALUES = (() => {
  const v: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      v.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return v;
})();

function arrivalLocaleForLang(lang: Lang): string {
  if (lang === "FR") return "fr-FR";
  if (lang === "SP") return "es-ES";
  return "en-GB";
}

function formatArrivalSlotLabel(value: string, locale: string): string {
  const [hh, mm] = value.split(":").map((x) => parseInt(x, 10));
  return new Date(2000, 0, 1, hh, mm).toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function filterErrorsForWizardStep(
  all: Record<string, string>,
  step: number
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(all).filter(([k]) => {
      if (step === 0) {
        return (
          k === "guestName" ||
          k === "guestEmail" ||
          k === "checkin" ||
          k === "checkout" ||
          k === "checkinHour"
        );
      }
      if (step === 1) return k.startsWith("traveler_");
      return true;
    })
  );
}

function usePhoneFormLayout() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setPhone(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return phone;
}

function firstWizardStepForErrors(errors: Record<string, string>): number {
  const keys = Object.keys(errors);
  const finish = 2;
  for (const k of keys) {
    if (
      k === "guestName" ||
      k === "guestEmail" ||
      k === "checkin" ||
      k === "checkout" ||
      k === "checkinHour"
    ) {
      return 0;
    }
  }
  for (const k of keys) {
    if (k.startsWith("traveler_")) return 1;
  }
  if (
    keys.includes("agreement") ||
    keys.includes("privacy") ||
    keys.includes("signature")
  ) {
    return 2;
  }
  return finish;
}

interface PropertyData {
  id: string;
  name: string;
  checkinTime: string;
  checkoutTime: string;
  houseRules?: string | null;
  formTitle?: string | null;
  formSubtitle?: string | null;
  goldPrimary?: string | null;
  showWhatsApp: boolean;
  requireSelfie: boolean;
  requireIdPhotos: boolean;
  /** Raw policy from DB; language resolved in the form from guest UI language. */
  privacyPolicy?: string | null;
}

export default function CheckInForm({
  property,
  initialLang = 'EN',
}: {
  property: PropertyData;
  /** From `/check-in/...?lang=FR` or returning from `/privacy?...&lang=FR`. */
  initialLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = TRANSLATIONS[lang];
  const brandPrimary = "#FF385C";
  
  const [isLoading, setIsLoading] = useState(false);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const sigRef = useRef<SignaturePad>(null);
  const [guestName, setGuestName] = useState('');
  const [otherTravelerNames, setOtherTravelerNames] = useState<Record<number, string>>({});
  const [hasAgreed, setHasAgreed] = useState(false);
  const [hasAgreedPrivacy, setHasAgreedPrivacy] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSigningActive, setIsSigningActive] = useState(false);
  const [whatsappValue, setWhatsappValue] = useState('');
  const whatsappParsed = useMemo(
    () => (property.showWhatsApp ? parseWhatsAppForCheckin(whatsappValue) : null),
    [property.showWhatsApp, whatsappValue]
  );
  const phoneLayout = usePhoneFormLayout();
  const finishStep = 2;
  const [wizardStep, setWizardStep] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const arrivalSlotLabels = useMemo(() => {
    const loc = arrivalLocaleForLang(lang);
    const map: Record<string, string> = {};
    for (const v of ARRIVAL_SLOT_VALUES) {
      map[v] = formatArrivalSlotLabel(v, loc);
    }
    return map;
  }, [lang]);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo(0, 0);
  }, [wizardStep, phoneLayout]);

  useEffect(() => {
    if (!phoneLayout || wizardStep !== finishStep) return;
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, [phoneLayout, wizardStep, finishStep]);

  const fieldErr = (key: string) =>
    validationErrors[key]
      ? 'border-red-500 bg-red-50/50 ring-1 ring-red-200'
      : 'border-[#B0B0B0] focus:border-[#222222] focus:ring-2 focus:ring-[#222222] focus:ring-offset-0';

  /** Unified web field system: aligned heights + consistent labels */
  const lbl =
    'block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#222222] mb-2';
  const inp =
    'w-full min-h-[3rem] md:min-h-[3.25rem] rounded-xl px-4 md:px-5 bg-white text-[#222222] text-base outline-none transition-[box-shadow,border-color] placeholder:text-[#717171]';

  useEffect(() => {
    const resizeCanvas = () => {
      if (sigRef.current) {
        const canvas = sigRef.current.getCanvas();
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d')?.scale(ratio, ratio);
        sigRef.current.clear();
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const rulesList = useMemo(
    () => resolveHouseRulesForLang(property.houseRules, lang),
    [property.houseRules, lang]
  );

  const privacyPolicyHtmlResolved = useMemo(
    () => getPrivacyPolicyHtml(property.privacyPolicy, lang),
    [property.privacyPolicy, lang]
  );

  const [travelers, setTravelers] = useState<Array<{
    country: 'MA' | 'OTHER' | '';
    noCIN: boolean;
    /** When document is OTHER, ISO region for dropdown label (from phone or unknown). */
    otherIso?: string;
  }>>([{ country: '', noCIN: true }]);

  /** Per traveler: user picked MA/OTHER explicitly — do not overwrite from WhatsApp. Cleared when they choose "Select country". */
  const countryLockedRef = useRef<boolean[]>([]);
  /** Bumps when a traveler clears country so WhatsApp inference can re-apply (parsed object may be referentially stable). */
  const [countryUnlockNonce, setCountryUnlockNonce] = useState(0);

  useEffect(() => {
    const total = adults + kids;
    const locks = countryLockedRef.current;
    while (locks.length < total) locks.push(false);
    if (locks.length > total) locks.length = total;

    const doc = property.showWhatsApp ? whatsappParsed?.document : undefined;
    const inferredIso =
      property.showWhatsApp && doc === 'OTHER' ? whatsappParsed?.iso2 : undefined;
    const inferredOtherIso = doc === 'MA' ? undefined : inferredIso;

    setTravelers((prev) => {
      let next = [...prev];
      while (next.length < total) {
        const i = next.length;
        const seeded =
          doc && !locks[i]
            ? {
                country: doc,
                noCIN: doc === 'MA' ? false : true,
                otherIso: inferredOtherIso,
              }
            : { country: '' as const, noCIN: true };
        next.push(seeded);
      }
      next = next.slice(0, total);

      if (doc) {
        next = next.map((t, i) => {
          if (locks[i]) return t;
          const noCIN = doc === 'MA' ? false : true;
          const otherIso = inferredOtherIso;
          if (
            t.country === doc &&
            t.noCIN === noCIN &&
            t.otherIso === otherIso
          ) {
            return t;
          }
          return { ...t, country: doc, noCIN, otherIso };
        });
      }

      const same =
        next.length === prev.length &&
        next.every(
          (t, i) =>
            t.country === prev[i]?.country &&
            t.noCIN === prev[i]?.noCIN &&
            t.otherIso === prev[i]?.otherIso
        );
      return same ? prev : next;
    });
  }, [adults, kids, property.showWhatsApp, whatsappParsed, countryUnlockNonce]);

  const computeValidationErrors = useCallback(
    (formDataObj: FormData): Record<string, string> => {
      const errors: Record<string, string> = {};

      if (!String(formDataObj.get("guestName") || "").trim())
        errors["guestName"] = t.errNameRequired;
      if (!String(formDataObj.get("guestEmail") || "").trim())
        errors["guestEmail"] = t.errEmailRequired;
      if (!formDataObj.get("checkin")) errors["checkin"] = t.errCheckinRequired;
      if (!formDataObj.get("checkout")) errors["checkout"] = t.errCheckoutRequired;
      if (!formDataObj.get("checkinHour"))
        errors["checkinHour"] = t.errArrivalRequired;

      travelers.forEach((traveler, index) => {
        if (!String(formDataObj.get(`traveler_${index}_name`) || "").trim()) {
          errors[`traveler_${index}_name`] = t.errNameRequired;
        }
        if (!String(formDataObj.get(`traveler_${index}_country`) || "").trim()) {
          errors[`traveler_${index}_country`] = t.errCountryRequired;
        }
        if (!formDataObj.get(`traveler_${index}_idNumber`))
          errors[`traveler_${index}_idNumber`] = t.errIdNumberRequired;

        if (property.requireIdPhotos) {
          const isPassport =
            traveler.country === "OTHER" ||
            traveler.country === "" ||
            traveler.noCIN;
          if (isPassport) {
            if (!(formDataObj.get(`traveler_${index}_passport`) as File)?.size)
              errors[`traveler_${index}_passport`] = t.errPassportRequired;
          } else {
            if (!(formDataObj.get(`traveler_${index}_cinFront`) as File)?.size)
              errors[`traveler_${index}_cinFront`] = t.errCinFrontRequired;
            if (!(formDataObj.get(`traveler_${index}_cinBack`) as File)?.size)
              errors[`traveler_${index}_cinBack`] = t.errCinBackRequired;
          }
        }
      });

      if (!hasAgreed) errors["agreement"] = t.errAgreementRequired;
      if (!hasAgreedPrivacy) errors["privacy"] = t.errPrivacyRequired;
      if (!sigRef.current || sigRef.current.isEmpty())
        errors["signature"] = t.errSignatureRequired;

      return errors;
    },
    [travelers, property.requireIdPhotos, t, hasAgreed, hasAgreedPrivacy]
  );

  const handleWizardContinue = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const all = computeValidationErrors(fd);
    const stepErrors = filterErrorsForWizardStep(all, wizardStep);
    if (Object.keys(stepErrors).length > 0) {
      setValidationErrors(stepErrors);
      scrollAreaRef.current?.scrollTo(0, 0);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setValidationErrors({});
    setWizardStep((s) => Math.min(finishStep, s + 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObj = new FormData(e.currentTarget);
    const errors = computeValidationErrors(formDataObj);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      if (phoneLayout) {
        setWizardStep(firstWizardStepForErrors(errors));
        scrollAreaRef.current?.scrollTo(0, 0);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);
    try {
      const signatureData = sigRef.current?.getTrimmedCanvas().toDataURL("image/png");
      if (!signatureData) {
        throw new Error(t.provideSignature);
      }
      const formData = new FormData(e.currentTarget);
      formData.set("signature", signatureData as string);
      formData.set("lang", lang);
      formData.set("propertyId", property.id);
      const result = await saveBooking(formData);
      if (result.success) {
        const next =
          result.redirectUrl ||
          (result.pdfName
            ? `/success?pdf=${encodeURIComponent(result.pdfName)}`
            : "/success");
        window.location.assign(next);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      const raw = error instanceof Error ? error.message : String(error);
      const lower = raw.toLowerCase();
      const looksNetwork =
        lower.includes("unexpected response") ||
        lower.includes("failed to fetch") ||
        lower.includes("network") ||
        lower.includes("load failed");
      alert(looksNetwork ? t.submissionNetworkError : raw || t.errorOccurred);
      setIsLoading(false);
    }
  };

  const showPersonal = !phoneLayout || wizardStep === 0;
  const showTravelers = !phoneLayout || wizardStep === 1;
  const showFinish = !phoneLayout || wizardStep === finishStep;

  return (
    <main
      className={`bg-[#F7F7F7] font-sans w-full max-w-full overflow-x-hidden ${
        phoneLayout
          ? "h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden overscroll-none"
          : "min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-24"
      }`}
      style={{ "--primary-color": brandPrimary } as CSSProperties}
    >
      <div
        className={`transition-all duration-300 ${
          isRulesOpen || isPrivacyOpen ? "blur-md grayscale-[0.2]" : ""
        } ${phoneLayout ? "flex flex-1 min-h-0 min-w-0 flex-col w-full" : "max-w-3xl mx-auto w-full"}`}
      >
        <div
          className={`bg-white shadow-xl shadow-gray-300/30 overflow-hidden border border-gray-200/80 max-w-full ${
            phoneLayout
              ? "flex flex-1 min-h-0 min-w-0 flex-col rounded-none border-x-0"
              : "rounded-3xl"
          }`}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-center gap-3 border-b border-[#DDDDDD]/50 bg-white/60 backdrop-blur-xl shrink-0 z-20 max-w-full min-w-0 ${
              phoneLayout ? "p-3 pt-safe checkin-px flex-row" : "p-6 sm:p-8 flex-col sm:flex-row gap-6 sticky top-0"
            }`}
          >
            <div
              className={`flex items-center gap-1 p-1 bg-[#F7F7F7] rounded-xl overflow-x-auto no-scrollbar shrink-0 border border-[#DDDDDD] ${
                phoneLayout ? "max-w-[55%]" : "w-full sm:w-auto gap-2 p-1.5"
              }`}
            >
              {(["EN", "FR", "SP"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`flex-1 sm:flex-none rounded-xl font-bold uppercase tracking-widest transition-all duration-500 text-[9px] px-3 py-2 sm:text-[10px] sm:px-6 sm:py-2.5
                    ${lang === l ? "bg-white text-[#222222] shadow-sm font-semibold" : "text-[#717171] hover:text-[#222222] hover:bg-white"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {phoneLayout && (
            <div className="shrink-0 checkin-px py-2.5 border-b border-[#DDDDDD]/40 bg-[#F7F7F7]/90">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#222222] truncate text-center">
                {property.formTitle || property.name}
              </p>
              <div className="flex justify-center gap-1.5 mt-2" role="tablist" aria-label="Form steps">
                {Array.from({ length: finishStep + 1 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === wizardStep ? "w-7 bg-[#FF385C]" : "w-1.5 bg-[#DDDDDD]"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-2.5">
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-[9px] font-bold text-[#FF385C] uppercase tracking-widest"
                >
                  Privacy
                </button>
                <span className="text-[#DDDDDD]">·</span>
                <button
                  type="button"
                  onClick={() => setIsRulesOpen(true)}
                  className="text-[9px] font-bold text-[#FF385C] uppercase tracking-widest"
                >
                  House rules
                </button>
              </div>
            </div>
          )}

          <div
            className={`text-center bg-gradient-to-b from-[#F7F7F7] to-white ${
              phoneLayout ? "checkin-px py-5" : "px-6 py-12 sm:py-16 sm:px-12"
            } ${phoneLayout && wizardStep !== 0 ? "hidden" : ""}`}
          >
            <span
              className={`inline-block bg-[#EBEBEB] rounded-full font-bold uppercase text-[#222222] ${
                phoneLayout
                  ? "px-3 py-1 text-[8px] tracking-[0.35em] mb-3"
                  : "px-4 py-1.5 text-[10px] tracking-[0.35em] mb-5"
              }`}
            >
              {t.title}
            </span>
            <h1
              className={`font-semibold text-[#222222] tracking-tight mb-3 sm:mb-4 leading-snug ${
                phoneLayout ? "text-2xl sm:text-[26px]" : "text-3xl sm:text-4xl"
              }`}
            >
              {property.formTitle || `${property.name}`}
            </h1>
            {property.formSubtitle && (
              <p
                className={`text-[#717171] font-normal max-w-lg mx-auto leading-relaxed ${
                  phoneLayout ? "text-sm" : "text-base sm:text-lg"
                }`}
              >
                {property.formSubtitle}
              </p>
            )}
          </div>

          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className={
              phoneLayout
                ? "flex flex-1 min-h-0 min-w-0 flex-col"
                : "px-6 sm:px-10 lg:px-12 pb-16 space-y-12 md:space-y-14"
            }
          >
            <div
              ref={scrollAreaRef}
              className={
                phoneLayout
                  ? "flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden checkin-app-scroll checkin-px pb-4 space-y-8"
                  : "contents"
              }
            >
              {Object.keys(validationErrors).length > 0 && (
                <div
                  className={`p-4 bg-red-50 border border-red-200 rounded-xl md:rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 ${
                    phoneLayout ? "" : "mb-2"
                  }`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.718-3L12 3 3.424 16c-.784 1.334.177 3 1.718 3z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[#222222] font-bold text-xs sm:text-sm tracking-tight">{t.errPleaseCheck}</h3>
                    <p className="text-[#FF385C] text-[11px] sm:text-xs font-medium opacity-80 break-words">{Object.values(validationErrors)[0]}</p>
                  </div>
                </div>
              )}

            <input type="hidden" name="totalTravelers" value={adults + kids} readOnly />
            <section
              className={`space-y-6 md:space-y-8 ${showPersonal ? "" : "hidden md:block"} ${!phoneLayout ? "md:rounded-2xl md:border md:border-[#EEEEEE] md:bg-[#FAFAFA] md:p-6 lg:p-8" : ""}`}
            >
              <div className="flex items-center gap-4 mb-0 md:mb-1">
                <div className="h-px min-w-[2rem] flex-1 bg-gradient-to-r from-transparent via-[#FF385C]/80 to-[#FF385C]/40" />
                <h2 className="text-xs md:text-sm font-bold text-[#222222] tracking-[0.25em] uppercase text-center shrink-0">
                  {t.personalInfo}
                </h2>
                <div className="h-px min-w-[2rem] flex-1 bg-gradient-to-l from-transparent via-[#FF385C]/80 to-[#FF385C]/40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
                <div className="flex flex-col min-w-0">
                  <label className={lbl} htmlFor="guestName">
                    {t.fullName}
                  </label>
                  <input
                    id="guestName"
                    name="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    required
                    autoComplete="name"
                    className={`${inp} border ${fieldErr('guestName')}`}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <label className={lbl} htmlFor="guestEmail">
                    {t.email}
                  </label>
                  <input
                    id="guestEmail"
                    name="guestEmail"
                    type="email"
                    autoComplete="email"
                    placeholder={t.emailPlaceholder}
                    required
                    className={`${inp} border ${fieldErr('guestEmail')}`}
                  />
                </div>

                {property.showWhatsApp && (
                  <div className="flex flex-col min-w-0 md:col-span-2">
                    <label className={lbl} htmlFor="whatsapp">
                      {t.whatsapp}
                    </label>
                    <div
                      className={`flex rounded-xl border bg-white overflow-hidden items-stretch min-h-[3rem] md:min-h-[3.25rem] transition-shadow focus-within:ring-2 focus-within:ring-offset-0 ${
                        validationErrors['whatsapp']
                          ? 'border-red-500 ring-1 ring-red-200'
                          : 'border-[#B0B0B0] focus-within:border-[#222222] focus-within:ring-[#222222]'
                      }`}
                    >
                      <div
                        className="flex items-center justify-center px-3 md:px-4 bg-[#F7F7F7] border-r border-[#DDDDDD] min-w-[3.25rem] md:min-w-[3.75rem] shrink-0 text-xl md:text-2xl leading-none select-none self-stretch"
                        title={whatsappParsed?.dialLabel ?? ''}
                        aria-hidden
                      >
                        {whatsappParsed?.flagEmoji ?? '📱'}
                      </div>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder={t.whatsappPlaceholder}
                        value={whatsappValue}
                        onChange={(e) => setWhatsappValue(e.target.value)}
                        className="flex-1 min-w-0 px-4 md:px-5 bg-transparent border-0 outline-none text-[#222222] placeholder:text-[#717171] text-base self-center py-2"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col min-w-0 md:col-span-2">
                  <span className={lbl}>{t.checkinDates}</span>
                  <DatePicker
                    name="checkin"
                    endDateName="checkout"
                    required
                    lang={lang}
                    error={!!(validationErrors['checkin'] || validationErrors['checkout'])}
                  />
                </div>

                <div className="flex flex-col min-w-0 md:col-span-2">
                  <label className={lbl} htmlFor="checkinHour">
                    {t.estimatedArrival}
                  </label>
                  <div
                    className={`relative flex items-center rounded-xl border bg-white min-h-[3rem] md:min-h-[3.25rem] pl-4 pr-10 md:pl-5 md:pr-11 transition-shadow focus-within:ring-2 focus-within:ring-offset-0 ${
                      validationErrors['checkinHour']
                        ? 'border-red-500 ring-1 ring-red-200'
                        : 'border-[#B0B0B0] focus-within:border-[#222222] focus-within:ring-[#222222]'
                    }`}
                  >
                    <select
                      id="checkinHour"
                      name="checkinHour"
                      required
                      defaultValue=""
                      className="w-full flex-1 min-h-0 cursor-pointer appearance-none bg-transparent border-0 outline-none font-medium text-[#222222] text-base py-2 pr-1"
                    >
                      <option value="" disabled>
                        {t.selectArrivalPlaceholder}
                      </option>
                      {ARRIVAL_SLOT_VALUES.map((v) => (
                        <option key={v} value={v}>
                          {arrivalSlotLabels[v] ?? v}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 md:right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717171]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            <section className={`space-y-6 md:space-y-8 ${showTravelers ? "" : "hidden md:block"} ${!phoneLayout ? "md:rounded-2xl md:border md:border-[#EEEEEE] md:bg-[#FAFAFA] md:p-6 lg:p-8" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="h-px min-w-[2rem] flex-1 bg-gradient-to-r from-transparent via-[#FF385C]/80 to-[#FF385C]/40" />
                <h2 className="text-xs md:text-sm font-bold text-[#222222] tracking-[0.25em] uppercase text-center shrink-0">
                  {t.numTravelers}
                </h2>
                <div className="h-px min-w-[2rem] flex-1 bg-gradient-to-l from-transparent via-[#FF385C]/80 to-[#FF385C]/40" />
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-6">
                {[ {id: 'adults', label: t.adults, value: adults, set: setAdults, min: 1}, {id: 'kids', label: t.kids, value: kids, set: setKids, min: 0} ].map((group) => (
                  <div key={group.id} className="p-4 md:p-6 bg-[#F7F7F7] rounded-2xl md:rounded-3xl border border-[#DDDDDD] flex flex-col items-center gap-3 md:gap-4 shadow-sm hover:shadow-md transition-shadow duration-500">
                    <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#222222] text-center">{group.label}</label>
                    <div className="flex items-center gap-4 md:gap-6">
                      <button type="button" onClick={() => group.set(Math.max(group.min, group.value - 1))} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-[#DDDDDD] flex items-center justify-center text-lg md:text-xl font-medium text-[#222222] hover:bg-[#DDDDDD] active:scale-90 transition-all">−</button>
                      <span className="text-2xl md:text-3xl font-semibold text-[#222222] min-w-[1.5rem] text-center tabular-nums">{group.value}</span>
                      <button type="button" onClick={() => group.set(group.value + 1)} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-[#DDDDDD] flex items-center justify-center text-lg md:text-xl font-medium text-[#222222] hover:bg-[#DDDDDD] active:scale-90 transition-all">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {travelers.map((traveler, index) => (
              <section
                key={index}
                className={`space-y-6 md:space-y-8 pt-6 md:pt-8 border-t border-[#EBEBEB] ${showTravelers ? "" : "hidden md:block"} ${!phoneLayout ? "md:rounded-2xl md:border md:border-[#EEEEEE] md:bg-[#FAFAFA] md:p-6 lg:p-8 md:mt-4" : ""}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-px w-8 shrink-0 bg-gradient-to-r from-[#FF385C] to-transparent md:hidden" />
                    <h2 className="text-xs md:text-sm font-bold text-[#222222] tracking-[0.2em] uppercase truncate">
                      {t.docInfo} — {index + 1}
                    </h2>
                  </div>
                  <span className="px-4 py-1.5 bg-white border border-[#E5E5E5] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#444] shadow-sm">
                    {index < adults ? t.adult : t.kid}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col min-w-0">
                    <label className={lbl} htmlFor={`traveler_${index}_name`}>
                      {t.fullName}
                    </label>
                    <input
                      id={`traveler_${index}_name`}
                      name={`traveler_${index}_name`}
                      value={index === 0 ? guestName : (otherTravelerNames[index] ?? '')}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (index === 0) setGuestName(v);
                        else setOtherTravelerNames((prev) => ({ ...prev, [index]: v }));
                      }}
                      placeholder={t.fullNamePlaceholder}
                      required
                      autoComplete={index === 0 ? 'name' : 'off'}
                      className={`${inp} border ${fieldErr(`traveler_${index}_name`)}`}
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <label className={lbl} htmlFor={`traveler_${index}_country`}>
                      {t.countryOfIssue}
                    </label>
                    <div className="relative">
                      <select
                        id={`traveler_${index}_country`}
                        name={`traveler_${index}_country`}
                        value={traveler.country}
                        onChange={(e) => {
                          const v = e.target.value as 'MA' | 'OTHER' | '';
                          const locks = countryLockedRef.current;
                          while (locks.length <= index) locks.push(false);
                          locks[index] = v !== '';
                          if (v === '') setCountryUnlockNonce((n) => n + 1);
                          const newTravelers = [...travelers];
                          newTravelers[index] = {
                            ...newTravelers[index],
                            country: v,
                            noCIN: v !== 'MA',
                            otherIso: undefined,
                          };
                          setTravelers(newTravelers);
                        }}
                        className={`${inp} cursor-pointer border appearance-none pr-10 font-medium ${fieldErr(`traveler_${index}_country`)}`}
                      >
                        <option value="">{t.selectCountry}</option>
                        <option value="MA">{t.morocco}</option>
                        <option value="OTHER">
                          {traveler.country === 'OTHER' && traveler.otherIso
                            ? regionDisplayName(traveler.otherIso, lang)
                            : t.otherCountry}
                        </option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"/></svg>
                      </div>
                    </div>
                  </div>

                  {traveler.country === 'MA' && (
                    <label className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl cursor-pointer group transition-all hover:bg-gray-100/50">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${traveler.noCIN ? 'bg-[var(--primary-color)] border-[var(--primary-color)]' : 'bg-white border-gray-200 group-hover:border-[var(--primary-color)]/30'}`}>
                        {traveler.noCIN && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                      </div>
                      <input type="checkbox" className="hidden" checked={traveler.noCIN} onChange={(e) => {
                        const newTravelers = [...travelers];
                        newTravelers[index].noCIN = e.target.checked;
                        setTravelers(newTravelers);
                      }} />
                      <span className="text-sm font-black text-gray-700 tracking-tight uppercase">{t.noCIN}</span>
                    </label>
                  )}

                  {traveler.country === 'MA' && traveler.noCIN && (
                    <p className="text-xs font-semibold text-gray-600 leading-snug -mt-1">
                      {t.docNoCinPassportGuide}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {traveler.country === 'OTHER' ||
                    traveler.country === '' ||
                    traveler.noCIN ? (
                      <div className="md:col-span-2">
                        <CameraCapture
                          name={`traveler_${index}_passport`}
                          guide="document"
                          documentVariant="passport"
                          guideTitle={t.docCameraTitlePassport}
                          frameCenterLabel={t.docFramePassport}
                          documentHint={
                            traveler.country === 'MA' && traveler.noCIN
                              ? t.docGuidePassportMaNoCin
                              : t.docGuidePassport
                          }
                          hasError={
                            !!validationErrors[`traveler_${index}_passport`]
                          }
                          lang={lang}
                          labels={t}
                        />
                      </div>
                    ) : (
                      <>
                        <CameraCapture
                          name={`traveler_${index}_cinFront`}
                          guide="document"
                          documentVariant="idFront"
                          guideTitle={t.docCameraTitleCinFront}
                          frameCenterLabel={t.docFrameCinFront}
                          documentHint={t.docGuideCinFront}
                          hasError={
                            !!validationErrors[`traveler_${index}_cinFront`]
                          }
                          lang={lang}
                          labels={t}
                        />
                        <CameraCapture
                          name={`traveler_${index}_cinBack`}
                          guide="document"
                          documentVariant="idBack"
                          guideTitle={t.docCameraTitleCinBack}
                          frameCenterLabel={t.docFrameCinBack}
                          documentHint={t.docGuideCinBack}
                          hasError={
                            !!validationErrors[`traveler_${index}_cinBack`]
                          }
                          lang={lang}
                          labels={t}
                        />
                      </>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <label className={lbl} htmlFor={`traveler_${index}_idNumber`}>
                      {(traveler.country === 'OTHER' || traveler.country === '' || traveler.noCIN) ? t.passportNumber : t.cinNumber}
                    </label>
                    <input
                      id={`traveler_${index}_idNumber`}
                      name={`traveler_${index}_idNumber`}
                      required
                      className={`${inp} border ${fieldErr(`traveler_${index}_idNumber`)}`}
                    />
                  </div>
                </div>
              </section>
            ))}

            <section className={`space-y-6 md:space-y-8 pt-6 md:pt-10 border-t border-[#EBEBEB] ${showFinish ? "" : "hidden md:block"} ${!phoneLayout ? "md:rounded-2xl md:border md:border-[#EEEEEE] md:bg-[#FAFAFA] md:p-6 lg:p-8 md:mt-2" : ""}`}>
               <div className="p-5 md:p-8 bg-[#1a1a1a] rounded-2xl md:rounded-3xl text-white space-y-4 md:space-y-6 shadow-lg shadow-gray-400/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em]">{t.privacyTitle}</h3>
                  </div>
                  <ul className="text-[11px] md:text-xs space-y-2 md:space-y-4 font-semibold opacity-80 leading-relaxed tracking-tight">
                    <li className="flex gap-2"><span>•</span> {t.privacyEmail}</li>
                    <li className="flex gap-2"><span>•</span> {t.privacyID}</li>
                    <li className="flex gap-2"><span>•</span> {t.privacySelfie}</li>
                    <li className="flex gap-2"><span>•</span> {t.privacyArrival}</li>
                  </ul>
               </div>

               <div className="space-y-3 md:space-y-4">
                 <button type="button" onClick={() => setHasAgreed(!hasAgreed)} className={`w-full p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-500 flex items-start gap-3 md:gap-4 text-left ${
                    validationErrors['agreement']
                      ? 'border-red-500 ring-1 ring-red-200 bg-red-50/40'
                      : hasAgreed
                        ? 'bg-[#F7F7F7] border-[#FF385C]/30 shadow-lg shadow-[#FF385C]/5'
                        : 'bg-[#F7F7F7] border-[#DDDDDD] hover:border-[#FF385C]/30'
                  }`}>
                    <div className={`w-6 h-6 rounded-lg border mt-0.5 shrink-0 flex items-center justify-center transition-all duration-500 ${hasAgreed ? 'bg-[#FF385C] border-[#FF385C]' : 'bg-white border-[#DDDDDD]'}`}>
                      {hasAgreed && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-tight tracking-tight ${hasAgreed ? 'text-[#222222]' : 'text-[#222222]'}`}>{t.houseRulesAgreement}</p>
                      <span onClick={(e) => { e.stopPropagation(); setIsRulesOpen(true); }} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF385C] hover:text-[#222222] underline mt-3 block transition-colors cursor-pointer">({t.readHouseRules})</span>
                    </div>
                 </button>

                 <button type="button" onClick={() => setHasAgreedPrivacy(!hasAgreedPrivacy)} className={`w-full p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-500 flex items-start gap-3 md:gap-4 text-left ${
                    validationErrors['privacy']
                      ? 'border-red-500 ring-1 ring-red-200 bg-red-50/40'
                      : hasAgreedPrivacy
                        ? 'bg-[#F7F7F7] border-[#FF385C]/30 shadow-lg shadow-[#FF385C]/5'
                        : 'bg-[#F7F7F7] border-[#DDDDDD] hover:border-[#FF385C]/30'
                  }`}>
                    <div className={`w-6 h-6 rounded-lg border mt-0.5 shrink-0 flex items-center justify-center transition-all duration-500 ${hasAgreedPrivacy ? 'bg-[#FF385C] border-[#FF385C]' : 'bg-white border-[#DDDDDD]'}`}>
                      {hasAgreedPrivacy && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-tight tracking-tight ${hasAgreedPrivacy ? 'text-[#222222]' : 'text-[#222222]'}`}>{t.privacyAgreement}</p>
                      <span onClick={(e) => { e.stopPropagation(); setIsPrivacyOpen(true); }} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF385C] hover:text-[#222222] underline mt-3 block transition-colors cursor-pointer">({t.privacyReadMore})</span>
                    </div>
                 </button>
               </div>
            </section>

            <section className={`space-y-6 md:space-y-8 pt-6 md:pt-10 border-t border-[#EBEBEB] ${showFinish ? "" : "hidden md:block"}`}>
              <div className="flex items-center gap-4">
                <div className="h-px min-w-[2rem] flex-1 bg-gradient-to-r from-transparent via-[#FF385C]/80 to-[#FF385C]/40" />
                <h2 className="text-xs md:text-sm font-bold text-[#222222] tracking-[0.25em] uppercase text-center shrink-0">
                  {t.signatureTitle}
                </h2>
                <div className="h-px min-w-[2rem] flex-1 bg-gradient-to-l from-transparent via-[#FF385C]/80 to-[#FF385C]/40" />
              </div>
              
              <div
                className={`relative border-2 md:border-4 rounded-2xl md:rounded-[2.5rem] bg-gray-50 overflow-hidden transition-all ${
                  validationErrors['signature']
                    ? 'border-red-500 ring-2 ring-red-200'
                    : isSigningActive
                      ? 'border-[var(--primary-color)]'
                      : 'border-gray-100'
                }`}
              >
                {!isSigningActive && (
                  <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer gap-4 group" onClick={() => setIsSigningActive(true)}>
                    <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform text-[#FF385C]">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">{t.clickToSign}</span>
                  </div>
                )}
                <SignaturePad ref={sigRef} canvasProps={{ className: "sigCanvas w-full cursor-crosshair" }} onBegin={() => setIsSigningActive(true)} />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => sigRef.current?.clear()}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-[10px] font-black uppercase tracking-widest text-gray-600 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-colors shadow-sm"
                >
                  {t.clearSignature}
                </button>
                {isSigningActive && (
                  <button
                    type="button"
                    onClick={() => setIsSigningActive(false)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    {t.doneSigning}
                  </button>
                )}
              </div>
            </section>

            {showFinish && phoneLayout && (
              <p className="text-center text-[9px] font-bold text-[#222222]/50 uppercase tracking-widest pt-2">
                Mamounia Check-In · Casablanca
              </p>
            )}

            <button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full mt-4 text-white font-bold rounded-xl md:rounded-2xl shadow-lg shadow-[#FF385C]/25 transition-all duration-300 hover:brightness-105 active:scale-[0.99] disabled:opacity-60 disabled:grayscale flex items-center justify-center gap-3 md:gap-4 uppercase tracking-[0.2em] md:tracking-[0.25em] bg-gradient-to-r from-[#FF385C] to-[#E31C5F] relative overflow-hidden group py-4 text-base md:py-5 md:text-lg ${phoneLayout ? "hidden" : ""}`}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
              {isLoading && <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />}
              {isLoading ? t.processingBtn : t.submit}
            </button>
            </div>

            {phoneLayout && (
              <div className="shrink-0 flex gap-2 checkin-px pt-2 pb-safe border-t border-[#DDDDDD]/70 bg-[#F7F7F7]/95 backdrop-blur-md max-w-full min-w-0">
                {wizardStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep((s) => Math.max(0, s - 1))}
                    className="shrink-0 px-4 py-3.5 rounded-2xl border-2 border-[#DDDDDD] text-[11px] font-bold uppercase tracking-widest text-[#222222] bg-white active:scale-[0.98] transition-transform"
                  >
                    {t.back}
                  </button>
                )}
                {wizardStep < finishStep ? (
                  <button
                    type="button"
                    onClick={handleWizardContinue}
                    className="flex-1 min-w-0 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF385C] to-[#E31C5F] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#FF385C]/25 active:scale-[0.99] transition-transform"
                  >
                    {t.continue}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 min-w-0 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF385C] to-[#E31C5F] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#FF385C]/25 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                    {isLoading ? t.processingBtn : t.submit}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Branded Footer */}
        <footer className={`mt-16 pb-8 text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 ${phoneLayout ? "hidden" : ""}`}>
          <div className="flex flex-col items-center gap-6">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#FF385C] to-transparent opacity-40" />
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-[#222222] tracking-[0.4em] uppercase">Mamounia Check-In Services</h3>
              <p className="text-[10px] font-medium text-[#717171] opacity-60 tracking-wider max-w-xs mx-auto leading-relaxed">Making guest check-in simple, secure, and compliant for short-term rental hosts worldwide.</p>
            </div>

            <div className="flex items-center gap-6">
               <button type="button" onClick={() => setIsPrivacyOpen(true)} className="text-[10px] font-bold text-[#FF385C] hover:text-[#222222] tracking-widest uppercase transition-colors cursor-pointer">Privacy</button>
               <span className="w-1 h-1 rounded-full bg-[#DDDDDD]" />
               <button type="button" onClick={() => setIsRulesOpen(true)} className="text-[10px] font-bold text-[#FF385C] hover:text-[#222222] tracking-widest uppercase transition-colors cursor-pointer">House Rules</button>
            </div>

            <div className="text-[9px] font-bold text-[#222222] opacity-40 uppercase tracking-[0.2em] space-y-1">
              <p>© 2026 Mamounia Check-In Services • Casablanca, Morocco</p>
            </div>
          </div>
        </footer>
      </div>

      {/* House Rules Modal */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-t-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 flex flex-col max-h-[92dvh] sm:max-h-[90vh]">
            <div className="p-5 sm:p-10 border-b border-gray-50 flex items-center justify-between bg-white text-black shrink-0">
              <h2 className="text-lg sm:text-3xl font-black text-gray-900 tracking-tighter uppercase pr-2">{t.houseRulesTitle}</h2>
              <button onClick={() => setIsRulesOpen(false)} className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-black">✕</button>
            </div>
            <div className="p-4 sm:p-10 flex-1 overflow-y-auto checkin-app-scroll space-y-4 sm:space-y-6">
               {rulesList.length === 0 ? (
                 <p className="text-gray-700 font-semibold text-sm leading-relaxed px-2">{t.houseRulesFallback}</p>
               ) : (
                 rulesList.map((rule: string, i: number) => (
                   <div key={i} className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-[2rem] border border-gray-100 items-start">
                     <span className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-red-500 font-black shrink-0 shadow-lg text-xs leading-none">{(i+1).toString().padStart(2, '0')}</span>
                     <p className="text-gray-700 font-black text-sm leading-relaxed tracking-tight">{rule}</p>
                   </div>
                 ))
               )}
            </div>
            <div className="p-4 sm:p-10 pb-safe sm:pb-10 bg-gray-50/50 shrink-0">
              <button onClick={() => setIsRulesOpen(false)} className="w-full py-4 sm:py-6 bg-gray-900 text-white font-black rounded-2xl sm:rounded-[2rem] shadow-2xl hover:bg-black transition-all text-xs sm:text-sm uppercase tracking-widest">
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl rounded-t-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 flex flex-col h-[92dvh] sm:h-[90vh]">
            <div className="p-5 sm:p-10 border-b border-gray-50 flex items-center justify-between bg-white text-black shrink-0">
              <h2 className="text-lg sm:text-3xl font-black text-gray-900 tracking-tighter uppercase pr-2">{t.privacyReadMore}</h2>
              <button onClick={() => setIsPrivacyOpen(false)} className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all font-black">✕</button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto checkin-app-scroll bg-[#FDFCF9] relative">
              <div
                className="luxury-privacy-container min-h-full"
                dangerouslySetInnerHTML={{ __html: privacyPolicyHtmlResolved }}
              />
            </div>
            <div className="p-4 sm:p-10 pb-safe sm:pb-10 bg-gray-50/50 shrink-0">
              <button onClick={() => setIsPrivacyOpen(false)} className="w-full py-4 sm:py-6 bg-gray-900 text-white font-black rounded-2xl sm:rounded-[2rem] shadow-2xl hover:bg-black transition-all text-xs sm:text-sm uppercase tracking-widest">
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && phoneLayout && (
        <div className="fixed inset-0 z-[150] bg-[#F7F7F7]/93 backdrop-blur-[3px] flex flex-col items-center justify-center gap-3 px-8 pb-safe pt-safe">
          <div className="w-10 h-10 border-[3px] border-[#FF385C]/25 border-t-[#FF385C] rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#222222] text-center">{t.processing}</p>
          <p className="text-xs text-[#717171] text-center max-w-[280px] leading-relaxed">{t.pleaseWait}</p>
        </div>
      )}
    </main>
  );
}
