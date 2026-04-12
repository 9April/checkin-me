import type { Lang } from './lang';

/** Built-in house rules (same copy as PDF). Single source for PDF + check-in UI. */
export const PDF_RULES_BY_LANG: Record<
  Lang,
  Array<{ t: string; d: string }>
> = {
  EN: [
    { t: '1. Check-in / Check-out', d: 'Check-in from 3:00 PM. Check-out before 11:00 AM unless prior agreement with the host.' },
    { t: '2. Number of Guests', d: 'Only persons mentioned in the reservation are authorized to stay. Additional persons must be declared and authorized in advance.' },
    { t: '3. Visitors', d: 'Please inform the host in advance for any visits. Access is reserved only for persons in the reservation.' },
    { t: '4. Noise and Neighbors', d: 'Guests must respect neighbors and avoid excessive noise, especially between 10:00 PM and 8:00 AM.' },
    { t: '5. Parties and Events', d: 'Parties, gatherings, or events are strictly prohibited without host authorization.' },
    { t: '6. No Smoking', d: 'Smoking is strictly prohibited inside. You may smoke outside on the balconies, keeping them clean.' },
    { t: '7. Fireplace Use', d: 'For safety reasons, using the fireplace is strictly prohibited.' },
    { t: '8. Pets', d: 'Pets are not allowed unless prior agreement with the host.' },
    { t: '9. Equipment and Appliances', d: 'Use equipment, furniture, and appliances with care. Contact the host before any unusual manipulation.' },
    { t: '10. Damages', d: 'Guests are liable for any damage. Report any damage immediately to the host.' },
    { t: '11. Cleanliness', d: 'The property must be kept clean and left in a proper state at check-out.' },
    { t: '12. Keys and Access', d: 'Guests are responsible for keys, badges, or access codes. Loss may incur additional fees.' },
    { t: '13. Illegal Activities', d: 'Any illegal activity is strictly prohibited and result in immediate eviction.' },
    { t: '14. Energy Saving', d: 'Please turn off lights, AC, heating, and appliances when not in use.' },
    { t: '15. Assistance', d: 'Contact the host before attempting any repairs.' },
    { t: '16. Security', d: 'Residents must follow security instructions and not use dangerous equipment.' },
  ],
  FR: [
    { t: '1. Arrivée / Départ', d: 'L’heure d’arrivée est à partir de 15h00. L’heure de départ est avant 11h00 sauf accord préalable avec l’hôte.' },
    { t: '2. Nombre de voyageurs', d: 'Seules les personnes mentionnées dans la réservation sont autorisées à séjourner dans le logement. Toute personne supplémentaire doit être déclarée et autorisée à l’avance par l’hôte.' },
    { t: '3. Visiteurs', d: 'Merci d’informer l’hôte à l’avance en cas de visite. L’accès au logement est réservé uniquement aux personnes indiquées dans la réservation.' },
    { t: '4. Bruit et respect du voisinage', d: 'Les voyageurs doivent respecter le voisinage et éviter tout bruit excessif, surtout entre 22h00 et 08h00.' },
    { t: '5. Fêtes et événements', d: 'Les fêtes, soirées ou rassemblements sont strictement interdits sans autorisation de l’hôte.' },
    { t: '6. Interdiction de fumer', d: 'Il est strictement interdit de fumer à l’intérieur du logement. Il est possible de fumer à l’extérieur, au niveau des deux balcons.' },
    { t: '7. Utilisation de la cheminée', d: 'Pour des raisons de sécurité, l’utilisation de la cheminée est strictement interdite.' },
    { t: '8. Animaux', d: 'Les animaux ne sont pas autorisés sauf accord préalable de l’hôte.' },
    { t: '9. Utilisation des équipements', d: 'Les voyageurs doivent utiliser les équipements, le mobilier et l’électroménager avec soin.' },
    { t: '10. Dégradations', d: 'Les voyageurs sont responsables de tout dommage causé. Tout dommage doit être signalé immédiatement.' },
    { t: '11. Propreté', d: 'Le logement doit être maintenu propre pendant le séjour et laissé dans un état correct au départ.' },
    { t: '12. Clés et accès', d: 'Les voyageurs sont responsables des clés, badges ou codes d’accès. La perte peut entraîner des frais.' },
    { t: '13. Activités illégales', d: 'Toute activité illégale est strictement interdite et peut entraîner l’annulation du séjour.' },
    { t: '14. Économie d’énergie', d: 'Merci d’éteindre les lumières, la climatisation et les appareils lorsque vous ne les utilisez pas.' },
    { t: '15. Assistance', d: 'En cas de problème, veuillez contacter l’hôte avant de tenter toute réparation.' },
    { t: '16. Sécurité', d: 'Les voyageurs doivent respecter les consignes de sécurité et ne pas utiliser d’équipements dangereux.' },
  ],
  SP: [
    { t: '1. Llegada / Salida', d: 'La hora de entrada es a partir de las 15:00. La hora de salida es antes de las 11:00 salvo acuerdo previo.' },
    { t: '2. Número de viajeros', d: 'Solo las personas mencionadas en la reserva están autorizadas a alojarse. Las personas adicionales deben ser autorizadas.' },
    { t: '3. Visitantes', d: 'Por favor, informe al anfitrión con antelación en caso de visitas. El acceso está reservado a los registrados.' },
    { t: '4. Ruido y vecindario', d: 'Los viajeros deben respetar el vecindario y evitar ruidos excesivos de 22:00 a 08:00.' },
    { t: '5. Fiestas y eventos', d: 'Las fiestas o reuniones están estrictamente prohibidas sin autorización.' },
    { t: '6. Prohibido fumar', d: 'Está estrictamente prohibido fumar en el interior. Se permite en los balcones manteniendo la limpieza.' },
    { t: '7. Uso de la chimenea', d: 'Por razones de seguridad, el uso de la chimenea está estrictamente prohibido.' },
    { t: '8. Mascotas', d: 'No se admiten mascotas salvo acuerdo previo con el anfitrión.' },
    { t: '9. Uso de equipos', d: 'Los viajeros deben utilizar el mobiliario y electrodomésticos con cuidado y según su uso normal.' },
    { t: '10. Daños', d: 'Los viajeros son responsables de cualquier daño. Informe inmediatamente al anfitrión.' },
    { t: '11. Limpieza', d: 'La vivienda debe mantenerse limpia y dejarse en un estado correcto al salir.' },
    { t: '12. Llaves y acceso', d: 'Los viajeros son responsables de las llaves y códigos. Su pérdida puede conllevar gastos.' },
    { t: '13. Activividades ilegales', d: 'Cualquier actividad ilegal está prohibida y puede causar la cancelación inmediata.' },
    { t: '14. Ahorro de energía', d: 'Apague las luces, el aire acondicionado y los aparatos cuando no los use.' },
    { t: '15. Asistencia', d: 'Contacte con el anfitrión antes de intentar cualquier reparación.' },
    { t: '16. Seguridad', d: 'Los viajeros deben respetar las normas de seguridad y no usar equipos peligrosos.' },
  ],
};

export function getBuiltinHouseRulesLines(lang: Lang): string[] {
  const rules = PDF_RULES_BY_LANG[lang] ?? PDF_RULES_BY_LANG.EN;
  return rules.map((r) => `${r.t}: ${r.d}`);
}
