document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signup-form");

    if (!form) {
        alert("Signup form not found.");
        return;
    }

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

            const { data, error } = await window.supabaseClient.auth.signUp({
                password
            });

            if (error) {
                alert(error.message);
                return;
            }

            const user = data.user;

            if (!user) {
                alert("Please verify your email before logging in.");
                return;
            }

            const { error: profileError } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
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

        } catch (err) {
            console.error(err);
            alert("Unexpected Error: " + err.message);
        }

    });

});
