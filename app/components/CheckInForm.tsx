"use client";
import { useState, useRef, useEffect, type CSSProperties } from "react";
import Link from 'next/link';
import SignaturePad from 'react-signature-canvas';
import { saveBooking } from '../actions';
import DatePicker from './DatePicker';
import CameraCapture from './CameraCapture';

type Lang = 'EN' | 'FR' | 'SP';

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
    whatsappPlaceholder: "e.g. +123456789",
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
    world: "World",
    noCIN: "Je n'ai pas de CIN / I don't have a CIN",
    cinFront: "CIN recto (front)",
    cinBack: "CIN verso (back)",
    cinNumber: "CIN number",
    passportPhoto: "Passport photo page",
    passportNumber: "Passport number",
    verification: "Verification",
    faceSelfie: "Face selfie (for verification)",
    houseRulesTitle: "House Rules",
    readHouseRules: "Read House Rules",
    houseRulesAgreement: "I agree to the house rules",
    mustAgree: "You must agree to the house rules to proceed.",
    close: "Close",
    estimatedArrival: "Estimated arrival time",
    privacyTitle: "How we use your data",
    privacyEmail: "Email: For booking confirmation and communication.",
    privacyID: "Identity Documents: Legal requirement for police reporting.",
    privacySelfie: "Selfie: To verify that you match your identity document.",
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
    whatsappPlaceholder: "ex: +33612345678",
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
    world: "Reste du monde",
    noCIN: "Je n'ai pas de CIN / I don't have a CIN",
    cinFront: "CIN recto",
    cinBack: "CIN verso",
    cinNumber: "Numéro de CIN",
    passportPhoto: "Page photo du passeport",
    passportNumber: "Numéro de passeport",
    verification: "Vérification",
    faceSelfie: "Selfie (pour vérification)",
    houseRulesTitle: "Règlement intérieur",
    readHouseRules: "Lire le règlement intérieur",
    houseRulesAgreement: "J'accepte le règlement intérieur",
    mustAgree: "Vous devez accepter le règlement intérieur pour continuer.",
    close: "Fermer",
    estimatedArrival: "Heure d'arrivée prévue",
    privacyTitle: "Utilisation de vos données",
    privacyEmail: "E-mail : Pour la confirmation et la communication.",
    privacyID: "Documents d'identité : Obligation légale (déclaration police).",
    privacySelfie: "Selfie : Pour vérifier l'identité de la personne présente.",
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
    whatsappPlaceholder: "ej: +34612345678",
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
    world: "Resto del mundo",
    noCIN: "No tengo CIN / I don't have a CIN",
    cinFront: "CIN anverso",
    cinBack: "CIN reverso",
    cinNumber: "Número de CIN",
    passportPhoto: "Página de la foto del pasaporte",
    passportNumber: "Número de pasaporte",
    verification: "Verificación",
    faceSelfie: "Selfie (para verificación)",
    houseRulesTitle: "Reglamento interno",
    readHouseRules: "Leer reglamento interno",
    houseRulesAgreement: "Acepto el reglamento interno",
    mustAgree: "Debe aceptar el reglamento interno para continuar.",
    close: "Cerrar",
    estimatedArrival: "Hora estimada de llegada",
    privacyTitle: "Uso de sus datos",
    privacyEmail: "Correo: Para confirmación y comunicación.",
    privacyID: "Documentos: Requisito legal para informe policial.",
    privacySelfie: "Selfie: Para verificar su identidad.",
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
  }
};

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

function firstWizardStepForErrors(
  errors: Record<string, string>,
  requireSelfie: boolean
): number {
  const keys = Object.keys(errors);
  const finish = requireSelfie ? 3 : 2;
  for (const k of keys) {
    if (
      k === "guestName" ||
      k === "guestEmail" ||
      k === "checkin" ||
      k === "checkinHour"
    ) {
      return 0;
    }
  }
  for (const k of keys) {
    if (k.startsWith("traveler_")) return 1;
  }
  if (requireSelfie && keys.includes("selfie")) return 2;
  return finish;
}

interface PropertyData {
  id: string;
  name: string;
  logoUrl?: string | null;
  checkinTime: string;
  checkoutTime: string;
  houseRules?: string | null;
  formTitle?: string | null;
  formSubtitle?: string | null;
  goldPrimary?: string | null;
  showWhatsApp: boolean;
  requireSelfie: boolean;
  requireIdPhotos: boolean;
}

export default function CheckInForm({ property }: { property: PropertyData }) {
  const [lang, setLang] = useState<Lang>('EN');
  const t = TRANSLATIONS[lang];
  const goldPrimary = '#C5A059'; 
  const deepCharcoal = '#1A1A1A';
  const luxuryCream = '#FDFCF9';
  
  const [isLoading, setIsLoading] = useState(false);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const sigRef = useRef<SignaturePad>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [hasAgreedPrivacy, setHasAgreedPrivacy] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSigningActive, setIsSigningActive] = useState(false);
  const phoneLayout = usePhoneFormLayout();
  const finishStep = property.requireSelfie ? 3 : 2;
  const [wizardStep, setWizardStep] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo(0, 0);
  }, [wizardStep, phoneLayout]);

  useEffect(() => {
    if (!phoneLayout || wizardStep !== finishStep) return;
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, [phoneLayout, wizardStep, finishStep]);

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

  let rulesList = [];
  try {
    rulesList = JSON.parse(property.houseRules || '[]');
  } catch (e) {
    rulesList = [];
  }

  const [travelers, setTravelers] = useState<Array<{
    country: 'MA' | 'OTHER' | '';
    noCIN: boolean;
  }>>([{ country: '', noCIN: true }]);

  useEffect(() => {
    const totalTravelers = adults + kids;
    setTravelers(prev => {
      const newTravelers = [...prev];
      while (newTravelers.length < totalTravelers) {
        newTravelers.push({ country: '', noCIN: true });
      }
      return newTravelers.slice(0, totalTravelers);
    });
  }, [adults, kids]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObj = new FormData(e.currentTarget);
    const errors: Record<string, string> = {};

    if (!formDataObj.get('guestName')) errors['guestName'] = t.errNameRequired;
    if (!formDataObj.get('guestEmail')) errors['guestEmail'] = t.errEmailRequired;
    if (!formDataObj.get('checkin')) errors['checkin'] = t.errCheckinRequired;
    if (!formDataObj.get('checkinHour')) errors['checkinHour'] = t.errArrivalRequired;

    travelers.forEach((traveler, index) => {
      if (!formDataObj.get(`traveler_${index}_idNumber`)) errors[`traveler_${index}_idNumber`] = t.errIdNumberRequired;
      
      // Photo validation only if property.requireIdPhotos is enabled
      if (property.requireIdPhotos) {
        const isPassport = traveler.country === 'OTHER' || traveler.country === '' || traveler.noCIN;
        if (isPassport) {
          if (!(formDataObj.get(`traveler_${index}_passport`) as File)?.size) errors[`traveler_${index}_passport`] = t.errPassportRequired;
        } else {
          if (!(formDataObj.get(`traveler_${index}_cinFront`) as File)?.size) errors[`traveler_${index}_cinFront`] = t.errCinFrontRequired;
          if (!(formDataObj.get(`traveler_${index}_cinBack`) as File)?.size) errors[`traveler_${index}_cinBack`] = t.errCinBackRequired;
        }
      }
    });

    if (property.requireSelfie && !selfieFile) errors['selfie'] = t.errSelfieRequired;
    if (!hasAgreed) errors['agreement'] = t.errAgreementRequired;
    if (!hasAgreedPrivacy) errors['privacy'] = t.errPrivacyRequired;
    if (!sigRef.current || sigRef.current.isEmpty()) errors['signature'] = t.errSignatureRequired;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      if (phoneLayout) {
        setWizardStep(firstWizardStepForErrors(errors, property.requireSelfie));
        scrollAreaRef.current?.scrollTo(0, 0);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);
    try {
      const signatureData = sigRef.current?.getTrimmedCanvas().toDataURL('image/png');
      if (!signatureData) {
         throw new Error(t.provideSignature);
      }
      const formData = new FormData(e.currentTarget);
      formData.set('signature', signatureData as string);
      formData.set('lang', lang);
      formData.set('propertyId', property.id);
      if (selfieFile) formData.set('selfie', selfieFile);

      const result = await saveBooking(formData);
      if (result.success) {
        const next =
          result.redirectUrl ||
          (result.pdfName
            ? `/success?pdf=${encodeURIComponent(result.pdfName)}`
            : '/success');
        window.location.assign(next);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : t.errorOccurred);
      setIsLoading(false);
    }
  };

  const showPersonal = !phoneLayout || wizardStep === 0;
  const showTravelers = !phoneLayout || wizardStep === 1;
  const showSelfie = property.requireSelfie && (!phoneLayout || wizardStep === 2);
  const showFinish = !phoneLayout || wizardStep === finishStep;

  return (
    <main
      className={`bg-[#FDFCF9] font-sans w-full max-w-full overflow-x-hidden ${
        phoneLayout
          ? "h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden overscroll-none"
          : "min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-24"
      }`}
      style={{ "--primary-color": goldPrimary } as CSSProperties}
    >
      <div
        className={`transition-all duration-300 ${
          isRulesOpen || isPrivacyOpen ? "blur-md grayscale-[0.2]" : ""
        } ${phoneLayout ? "flex flex-1 min-h-0 min-w-0 flex-col w-full" : "max-w-2xl mx-auto"}`}
      >
        <div
          className={`bg-white shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 max-w-full ${
            phoneLayout
              ? "flex flex-1 min-h-0 min-w-0 flex-col rounded-none border-x-0"
              : "rounded-[2.5rem]"
          }`}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-center gap-3 border-b border-[#F4EBD0]/50 bg-white/60 backdrop-blur-xl shrink-0 z-20 max-w-full min-w-0 ${
              phoneLayout ? "p-3 pt-safe checkin-px flex-row" : "p-6 sm:p-8 flex-col sm:flex-row gap-6 sticky top-0"
            }`}
          >
            <div
              className={`flex items-center gap-1 p-1 bg-[#F9F7F2] rounded-2xl overflow-x-auto no-scrollbar shrink-0 ${
                phoneLayout ? "max-w-[55%]" : "w-full sm:w-auto gap-2 p-1.5"
              }`}
            >
              {(["EN", "FR", "SP"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`flex-1 sm:flex-none rounded-xl font-bold uppercase tracking-widest transition-all duration-500 text-[9px] px-3 py-2 sm:text-[10px] sm:px-6 sm:py-2.5
                    ${lang === l ? "bg-white text-[#C5A059] shadow-sm" : "text-gray-400 hover:text-[#C5A059] hover:bg-white/50"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            {property.logoUrl && (
              <div
                className={`bg-white rounded-2xl border border-[#F4EBD0]/50 shadow-sm flex items-center justify-center shrink-0 ${
                  phoneLayout ? "px-3 py-2" : "px-8 py-6 rounded-3xl"
                }`}
              >
                <img
                  src={property.logoUrl}
                  alt={property.name}
                  className={`object-contain ${phoneLayout ? "h-10 max-w-[120px]" : "h-20 sm:h-24 max-w-[280px]"}`}
                />
              </div>
            )}
          </div>

          {phoneLayout && (
            <div className="shrink-0 checkin-px py-2.5 border-b border-[#F4EBD0]/40 bg-[#FDFCF9]/90">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B08D43] truncate text-center">
                {property.formTitle || property.name}
              </p>
              <div className="flex justify-center gap-1.5 mt-2" role="tablist" aria-label="Form steps">
                {Array.from({ length: finishStep + 1 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === wizardStep ? "w-7 bg-[#C5A059]" : "w-1.5 bg-[#F4EBD0]"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-2.5">
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-[9px] font-bold text-[#C5A059] uppercase tracking-widest"
                >
                  Privacy
                </button>
                <span className="text-[#F4EBD0]">·</span>
                <button
                  type="button"
                  onClick={() => setIsRulesOpen(true)}
                  className="text-[9px] font-bold text-[#C5A059] uppercase tracking-widest"
                >
                  House rules
                </button>
              </div>
            </div>
          )}

          <div
            className={`text-center bg-gradient-to-b from-[#FDFCF9] to-white ${
              phoneLayout ? "checkin-px py-5" : "px-6 py-20 sm:px-12"
            } ${phoneLayout && wizardStep !== 0 ? "hidden" : ""}`}
          >
            <span
              className={`inline-block bg-[#F4EBD0] rounded-full font-bold uppercase text-[#B08D43] ${
                phoneLayout
                  ? "px-3 py-1 text-[8px] tracking-[0.35em] mb-3"
                  : "px-5 py-2 text-[10px] tracking-[0.4em] mb-8 animate-pulse"
              }`}
            >
              {t.title}
            </span>
            <h1
              className={`font-bold text-[#1A1A1A] tracking-tighter mb-3 sm:mb-6 leading-[1.1] font-serif italic ${
                phoneLayout ? "text-2xl sm:text-3xl" : "text-5xl"
              }`}
            >
              {property.formTitle || `${property.name}`}
            </h1>
            {property.formSubtitle && (
              <p
                className={`text-[#6B635C] font-medium max-w-md mx-auto leading-relaxed tracking-tight opacity-80 ${
                  phoneLayout ? "text-sm" : "text-lg"
                }`}
              >
                {property.formSubtitle}
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className={
              phoneLayout
                ? "flex flex-1 min-h-0 min-w-0 flex-col"
                : "px-6 sm:px-12 pb-12 space-y-12"
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
                  className={`p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 ${
                    phoneLayout ? "" : "mx-6 sm:mx-12 mb-12 p-5 rounded-3xl"
                  }`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.718-3L12 3 3.424 16c-.784 1.334.177 3 1.718 3z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[#B08D43] font-bold text-xs sm:text-sm tracking-tight">{t.errPleaseCheck}</h3>
                    <p className="text-[#C5A059] text-[11px] sm:text-xs font-medium opacity-80 break-words">{Object.values(validationErrors)[0]}</p>
                  </div>
                </div>
              )}

            <input type="hidden" name="totalTravelers" value={adults + kids} readOnly />
            <section
              className={`space-y-6 md:space-y-10 ${showPersonal ? "" : "hidden md:block"}`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent flex-1" />
                <h2 className="text-sm font-bold text-[#B08D43] tracking-[0.3em] uppercase">{t.personalInfo}</h2>
                <div className="w-12 h-0.5 bg-gradient-to-r from-[#C5A059] via-[#C5A059] to-transparent flex-1 opacity-20" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B08D43] ml-1">{t.fullName}</label>
                  <input name="guestName" placeholder={t.fullNamePlaceholder} required className={`w-full px-4 py-3.5 md:px-6 md:py-5 bg-[#FDFCF9] border border-[#F4EBD0] rounded-2xl outline-none focus:bg-white transition-all duration-500 font-medium text-[#1A1A1A] placeholder:text-[#B08D43]/30 text-base ${validationErrors['guestName'] ? 'border-amber-200 bg-amber-50' : 'focus:border-[#C5A059] focus:shadow-lg focus:shadow-[#C5A059]/5'}`} />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B08D43] ml-1">{t.email}</label>
                  <input name="guestEmail" type="email" placeholder={t.emailPlaceholder} required className={`w-full px-4 py-3.5 md:px-6 md:py-5 bg-[#FDFCF9] border border-[#F4EBD0] rounded-2xl outline-none focus:bg-white transition-all duration-500 font-medium text-[#1A1A1A] placeholder:text-[#B08D43]/30 text-base ${validationErrors['guestEmail'] ? 'border-amber-200 bg-amber-50' : 'focus:border-[#C5A059] focus:shadow-lg focus:shadow-[#C5A059]/5'}`} />
                </div>
                
                {property.showWhatsApp && (
                  <div className="space-y-2 md:space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">{t.whatsapp}</label>
                    <input name="whatsapp" type="tel" placeholder={t.whatsappPlaceholder} className="w-full px-4 py-3.5 md:px-6 md:py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[var(--primary-color)] transition-all font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-medium text-base" />
                  </div>
                )}

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">{t.checkinDates}</label>
                  <DatePicker name="checkin" endDateName="checkout" required lang={lang} />
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">{t.estimatedArrival}</label>
                  <input name="checkinHour" type="time" required className="w-full px-4 py-3.5 md:px-6 md:py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[var(--primary-color)] transition-all font-black text-gray-900 text-base" />
                </div>
              </div>
            </section>

            <section className={`space-y-5 md:space-y-8 ${showTravelers ? "" : "hidden md:block"}`}>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: goldPrimary }} />
                <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tighter uppercase">{t.numTravelers}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[ {id: 'adults', label: t.adults, value: adults, set: setAdults, min: 1}, {id: 'kids', label: t.kids, value: kids, set: setKids, min: 0} ].map((group) => (
                  <div key={group.id} className="p-4 md:p-6 bg-[#FDFCF9] rounded-2xl md:rounded-3xl border border-[#F4EBD0] flex flex-col items-center gap-3 md:gap-4 shadow-sm hover:shadow-md transition-shadow duration-500">
                    <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#B08D43] text-center">{group.label}</label>
                    <div className="flex items-center gap-4 md:gap-6">
                      <button type="button" onClick={() => group.set(Math.max(group.min, group.value - 1))} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-[#F4EBD0] flex items-center justify-center text-lg md:text-xl font-medium text-[#B08D43] hover:bg-[#F4EBD0] active:scale-90 transition-all">−</button>
                      <span className="text-2xl md:text-3xl font-bold text-[#1A1A1A] min-w-[1.5rem] text-center font-serif italic">{group.value}</span>
                      <button type="button" onClick={() => group.set(group.value + 1)} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-[#F4EBD0] flex items-center justify-center text-lg md:text-xl font-medium text-[#B08D43] hover:bg-[#F4EBD0] active:scale-90 transition-all">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {travelers.map((traveler, index) => (
              <section key={index} className={`space-y-4 md:space-y-6 pt-6 md:pt-8 border-t border-gray-50 ${showTravelers ? "" : "hidden md:block"}`}>
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-4">
                    <div className="w-12 h-0.5 bg-[#F4EBD0]/50" />
                    <h2 className="text-sm font-bold text-[#B08D43] tracking-[0.3em] uppercase">
                      {t.docInfo} - #{index + 1}
                    </h2>
                  </div>
                  <span className="px-5 py-2 bg-[#F4EBD0]/30 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#B08D43]">
                    {index < adults ? t.adult : t.kid}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Traveler Name Field */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">{t.fullName}</label>
                    <input 
                      name={`traveler_${index}_name`}
                      defaultValue={index === 0 ? '' : ''} 
                      placeholder={t.fullNamePlaceholder}
                      required 
                      className={`w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[var(--primary-color)] transition-all font-medium text-gray-900 placeholder:text-gray-300 ${validationErrors[`traveler_${index}_name`] ? 'border-amber-200 bg-amber-50' : ''}`} 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">{t.countryOfIssue}</label>
                    <div className="relative">
                      <select
                        name={`traveler_${index}_country`}
                        value={traveler.country}
                        onChange={(e) => {
                          const newTravelers = [...travelers];
                          newTravelers[index].country = e.target.value as any;
                          newTravelers[index].noCIN = e.target.value !== 'MA';
                          setTravelers(newTravelers);
                        }}
                        className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[var(--primary-color)] transition-all font-black text-gray-900 appearance-none"
                      >
                        <option value="">{t.selectCountry}</option>
                        <option value="MA">{t.morocco}</option>
                        <option value="OTHER">{t.world}</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    { (traveler.country === 'OTHER' || traveler.country === '' || traveler.noCIN) ? (
                      <div className="md:col-span-2">
                        <CameraCapture name={`traveler_${index}_passport`} guide="document" lang={lang} labels={t} />
                      </div>
                    ) : (
                      <>
                        <CameraCapture name={`traveler_${index}_cinFront`} guide="document" lang={lang} labels={t} />
                        <CameraCapture name={`traveler_${index}_cinBack`} guide="document" lang={lang} labels={t} />
                      </>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">
                      {(traveler.country === 'OTHER' || traveler.country === '' || traveler.noCIN) ? t.passportNumber : t.cinNumber}
                    </label>
                    <input name={`traveler_${index}_idNumber`} required className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[var(--primary-color)] transition-all font-black text-gray-900 placeholder:text-gray-300" />
                  </div>
                </div>
              </section>
            ))}

            {showSelfie && (
              <section className="space-y-5 md:space-y-8 pt-6 md:pt-8 border-t border-[#F4EBD0]/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-0.5 bg-[#F4EBD0]/50" />
                  <h2 className="text-sm font-bold text-[#B08D43] tracking-[0.3em] uppercase">{t.verification}</h2>
                </div>
                <CameraCapture name="selfie" lang={lang} labels={t} onCapture={setSelfieFile} />
              </section>
            )}

            <section className={`space-y-5 md:space-y-8 pt-6 md:pt-8 border-t border-gray-50 ${showFinish ? "" : "hidden md:block"}`}>
               <div className="p-5 md:p-8 bg-gray-900 rounded-2xl md:rounded-[2.5rem] text-white space-y-4 md:space-y-6 shadow-2xl shadow-gray-200">
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
                 <button type="button" onClick={() => setHasAgreed(!hasAgreed)} className={`w-full p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-500 flex items-start gap-3 md:gap-4 text-left ${hasAgreed ? 'bg-[#FDFCF9] border-[#C5A059]/30 shadow-lg shadow-[#C5A059]/5' : 'bg-[#FDFCF9] border-[#F4EBD0] hover:border-[#C5A059]/30'}`}>
                    <div className={`w-6 h-6 rounded-lg border mt-0.5 shrink-0 flex items-center justify-center transition-all duration-500 ${hasAgreed ? 'bg-[#C5A059] border-[#C5A059]' : 'bg-white border-[#F4EBD0]'}`}>
                      {hasAgreed && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-tight tracking-tight ${hasAgreed ? 'text-[#B08D43]' : 'text-[#1A1A1A]'}`}>{t.houseRulesAgreement}</p>
                      <span onClick={(e) => { e.stopPropagation(); setIsRulesOpen(true); }} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] hover:text-[#B08D43] underline mt-3 block transition-colors cursor-pointer">({t.readHouseRules})</span>
                    </div>
                 </button>

                 <button type="button" onClick={() => setHasAgreedPrivacy(!hasAgreedPrivacy)} className={`w-full p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-500 flex items-start gap-3 md:gap-4 text-left ${hasAgreedPrivacy ? 'bg-[#FDFCF9] border-[#C5A059]/30 shadow-lg shadow-[#C5A059]/5' : 'bg-[#FDFCF9] border-[#F4EBD0] hover:border-[#C5A059]/30'}`}>
                    <div className={`w-6 h-6 rounded-lg border mt-0.5 shrink-0 flex items-center justify-center transition-all duration-500 ${hasAgreedPrivacy ? 'bg-[#C5A059] border-[#C5A059]' : 'bg-white border-[#F4EBD0]'}`}>
                      {hasAgreedPrivacy && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-tight tracking-tight ${hasAgreedPrivacy ? 'text-[#B08D43]' : 'text-[#1A1A1A]'}`}>{t.privacyAgreement}</p>
                      <span onClick={(e) => { e.stopPropagation(); setIsPrivacyOpen(true); }} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] hover:text-[#B08D43] underline mt-3 block transition-colors cursor-pointer">({t.privacyReadMore})</span>
                    </div>
                 </button>
               </div>
            </section>

            <section className={`space-y-5 md:space-y-8 pt-6 md:pt-8 border-t border-[#F4EBD0]/30 ${showFinish ? "" : "hidden md:block"}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-0.5 bg-[#F4EBD0]/50" />
                <h2 className="text-sm font-bold text-[#B08D43] tracking-[0.3em] uppercase">{t.signatureTitle}</h2>
              </div>
              
              <div className={`relative border-2 md:border-4 rounded-2xl md:rounded-[2.5rem] bg-gray-50 overflow-hidden transition-all ${isSigningActive ? 'border-[var(--primary-color)]' : 'border-gray-100'}`}>
                {!isSigningActive && (
                  <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer gap-4 group" onClick={() => setIsSigningActive(true)}>
                    <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ color: goldPrimary }}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">{t.clickToSign}</span>
                  </div>
                )}
                <SignaturePad ref={sigRef} canvasProps={{ className: "sigCanvas w-full cursor-crosshair" }} onBegin={() => setIsSigningActive(true)} />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                   <button type="button" onClick={(e) => { e.stopPropagation(); sigRef.current?.clear(); }} className="px-6 py-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[var(--primary-color)] transition-colors">
                     {t.clearSignature}
                   </button>
                   {isSigningActive && (
                     <button type="button" onClick={() => setIsSigningActive(false)} className="px-6 py-2 bg-green-500 shadow-lg shadow-green-200 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-green-600 transition-all">
                       {t.doneSigning}
                     </button>
                   )}
                </div>
              </div>
            </section>

            {showFinish && phoneLayout && (
              <p className="text-center text-[9px] font-bold text-[#B08D43]/50 uppercase tracking-widest pt-2">
                Mamounia Check-In · Casablanca
              </p>
            )}

            <button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full text-white font-bold rounded-2xl md:rounded-3xl shadow-2xl transition-all duration-700 hover:scale-[1.01] active:scale-95 disabled:grayscale flex items-center justify-center gap-3 md:gap-4 uppercase tracking-[0.2em] md:tracking-[0.3em] bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#B08D43] relative overflow-hidden group shadow-[#C5A059]/20 py-5 text-base md:py-8 md:text-xl ${phoneLayout ? "hidden" : ""}`}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
              {isLoading && <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />}
              {isLoading ? t.processingBtn : t.submit}
            </button>
            </div>

            {phoneLayout && (
              <div className="shrink-0 flex gap-2 checkin-px pt-2 pb-safe border-t border-[#F4EBD0]/70 bg-[#FDFCF9]/95 backdrop-blur-md max-w-full min-w-0">
                {wizardStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep((s) => Math.max(0, s - 1))}
                    className="shrink-0 px-4 py-3.5 rounded-2xl border-2 border-[#F4EBD0] text-[11px] font-bold uppercase tracking-widest text-[#B08D43] bg-white active:scale-[0.98] transition-transform"
                  >
                    {t.back}
                  </button>
                )}
                {wizardStep < finishStep ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((s) => Math.min(finishStep, s + 1))}
                    className="flex-1 min-w-0 py-3.5 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#B08D43] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#C5A059]/25 active:scale-[0.99] transition-transform"
                  >
                    {t.continue}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 min-w-0 py-3.5 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#B08D43] text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#C5A059]/25 disabled:opacity-60 flex items-center justify-center gap-2"
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
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-40" />
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-[#B08D43] tracking-[0.4em] uppercase">Mamounia Check-In Services</h3>
              <p className="text-[10px] font-medium text-[#6B635C] opacity-60 tracking-wider max-w-xs mx-auto leading-relaxed">Making guest check-in simple, secure, and compliant for short-term rental hosts worldwide.</p>
            </div>

            <div className="flex items-center gap-6">
               <button type="button" onClick={() => setIsPrivacyOpen(true)} className="text-[10px] font-bold text-[#C5A059] hover:text-[#B08D43] tracking-widest uppercase transition-colors cursor-pointer">Privacy</button>
               <span className="w-1 h-1 rounded-full bg-[#F4EBD0]" />
               <button type="button" onClick={() => setIsRulesOpen(true)} className="text-[10px] font-bold text-[#C5A059] hover:text-[#B08D43] tracking-widest uppercase transition-colors cursor-pointer">House Rules</button>
            </div>

            <div className="text-[9px] font-bold text-[#B08D43] opacity-40 uppercase tracking-[0.2em] space-y-1">
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
               {rulesList.map((rule: string, i: number) => (
                 <div key={i} className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-[2rem] border border-gray-100 items-start">
                   <span className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-red-500 font-black shrink-0 shadow-lg text-xs leading-none">{(i+1).toString().padStart(2, '0')}</span>
                   <p className="text-gray-700 font-black text-sm leading-relaxed tracking-tight">{rule}</p>
                 </div>
               ))}
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
            <div className="flex-1 overflow-hidden relative bg-[#FDFCF9]">
               <iframe 
                src={`/privacy?propertyId=${property.id}&is_modal=true`} 
                className="w-full h-full border-none"
                title="Privacy Policy"
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
        <div className="fixed inset-0 z-[150] bg-[#FDFCF9]/93 backdrop-blur-[3px] flex flex-col items-center justify-center gap-3 px-8 pb-safe pt-safe">
          <div className="w-10 h-10 border-[3px] border-[#C5A059]/25 border-t-[#C5A059] rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#B08D43] text-center">{t.processing}</p>
          <p className="text-xs text-[#6B635C] text-center max-w-[280px] leading-relaxed">{t.pleaseWait}</p>
        </div>
      )}
    </main>
  );
}
