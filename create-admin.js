const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERRO: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não definidos no .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
  console.log("Tentando criar a conta de admin (admin@controleobra.com / admin123)...");
  
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@controleobra.com',
    password: 'admin123',
    options: {
      data: {
        full_name: 'Administrador',
      },
    },
  });

  if (error) {
    console.error("Falha ao criar o admin:", error.message);
  } else {
    console.log("Conta criada com sucesso!");
    console.log("Email: admin@controleobra.com");
    console.log("Senha: admin123");
    console.log("AVISO: Dependendo da configuração do seu Supabase Auth, pode ser necessário 'Confirmar Email' no painel para efetuar o login com sucesso. Se o Autoconfirm estiver ligado, já pode logar!");
  }
}

createAdmin();
