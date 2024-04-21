const Auth = artifacts.require("Auth");

contract("Auth", (accounts) => {
  it("should return all appointments", async () => {
    const authInstance = await Auth.deployed();

    // // Create some appointments
    await authInstance.bookAppointment(
      "John",
      "Doe",
      "john.doe@example.com",
      "123456",
      "123 Test street",
      "10:AM",
      "Dr. Smith",
      "Pending",
      { from: accounts[0] }
    );

    await authInstance.bookAppointment(
      "Ammar",
      "Khalid",
      "ammar.doe@example.com",
      "1234561321",
      "134 Test street",
      "12:AM",
      "Dr. Jmith",
      "done",
      { from: accounts[0] }
    );

    // Call getAllAppointments
    const appointments = await authInstance.getAllAppointments();
    console.log(appointments);

    // Verify the result
    assert.equal(
      appointments.length,
      2,
      "Returned correct number of appointments"
    );
    // Add more assertions as needed to verify the contents of the appointments
  });
});
