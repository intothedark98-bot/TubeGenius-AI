// Get the signup form
const form = document.getElementById("signup-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        // Create user in Supabase Authentication
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) throw error;

        const user = data.user ?? data.session?.user;

        if (!user) {
            alert("Account created! Please check your email to verify your account.");
            return;
        }

        // Insert profile into database
        const { error: profileError } = await supabase
            .from("profiles")
            .insert([
                {
                    id: user.id,
                    full_name: fullName,
                    plan: "Free",
                    videos_used: 0
                }
            ]);

        if (profileError) throw profileError;

        alert("Account created successfully!");

        window.location.href = "login.html";

    } catch (err) {
        alert(err.message);
        console.error(err);
    }
});
