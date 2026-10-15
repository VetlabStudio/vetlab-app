-- À exécuter une fois dans Supabase > SQL Editor.
-- P-15 : le courriel du profil (profiles.email) sert à envoyer les
-- courriels d'abonnement, de transfert et d'annulation. Il n'était pas
-- mis à jour quand une personne changeait d'adresse, et l'app pouvait
-- l'écrire elle-même. Désormais il suit toujours l'adresse confirmée
-- du compte, et seul le serveur le modifie.

begin;

create or replace function public.synchroniser_courriel_profil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists sur_changement_courriel on auth.users;
create trigger sur_changement_courriel
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.synchroniser_courriel_profil();

-- Rattrapage : les profils dont l'adresse ne correspond plus au compte.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is distinct from u.email;

-- L'app ne modifie plus que le nom et la photo.
revoke update (email) on public.profiles from authenticated;

commit;

-- Vérification : une seule ligne attendue, avec « avatar_url, nom ».
-- Si la colonne email y figure encore, ou si la table entière est
-- modifiable (table_entiere = true), envoyez-moi le résultat.
select
  has_table_privilege('authenticated', 'public.profiles', 'UPDATE') as table_entiere,
  string_agg(column_name, ', ' order by column_name) as colonnes_modifiables
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'profiles'
  and grantee = 'authenticated' and privilege_type = 'UPDATE';
