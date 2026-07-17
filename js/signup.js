document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signup-form");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const fullName = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) {
                alert(error.message);
                return;
            }

            if (!data.user) {
                alert("Account created. Please verify your email.");
                return;
            }

            const { error: profileError } = await supabase
                .from("profiles")
                .insert({
                    id: data.user.id,
                    full_name: fullName,
                    plan: "Free",
                    videos_used: 0
                });

            if (profileError) {
                alert(profileError.message);
                return;
            }

            alert("🎉 Account created successfully!");

            window.location.href = "login.html";

        }

        catch (err) {
            alert(err.message);
            console.error(err);
        }

    });

});
