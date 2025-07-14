export default (TIMEOUT) => async function (req, res) {
  await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
  res.json({
    products: [
      {
        id: 101,
        title: "Apple AirPods Max Silver",
        description: "The Apple AirPods Max in Silver are premium over-ear headphones with high-fidelity audio, adaptive EQ, and active noise cancellation. Experience immersive sound in style."
      },
      {
        id: 104,
        title: "Apple iPhone Charger",
        description: "The Apple iPhone Charger is a high-quality charger designed for fast and efficient charging of your iPhone. Ensure your device stays powered up and ready to go."
      },
      {
        id: 105,
        title: "Apple MagSafe Battery Pack",
        description: "The Apple MagSafe Battery Pack is a portable and convenient way to add extra battery life to your MagSafe-compatible iPhone. Attach it magnetically for a secure connection."
      },
      {
        id: 107,
        title: "Beats Flex Wireless Earphones",
        description: "The Beats Flex Wireless Earphones offer a comfortable and versatile audio experience. With magnetic earbuds and up to 12 hours of battery life, they are ideal for everyday use."
      },
      {
        id: 108,
        title: "iPhone 12 Silicone Case with MagSafe Plum",
        description: "The iPhone 12 Silicone Case with MagSafe in Plum is a stylish and protective case designed for the iPhone 12. It features MagSafe technology for easy attachment of accessories."
      },
      {
        id: 110,
        title: "Selfie Lamp with iPhone",
        description: "The Selfie Lamp with iPhone is a portable and adjustable LED light designed to enhance your selfies and video calls. Attach it to your iPhone for well-lit photos."
      },
      {
        id: 111,
        title: "Selfie Stick Monopod",
        description: "The Selfie Stick Monopod is a extendable and foldable device for capturing the perfect selfie or group photo. Compatible with smartphones and cameras."
      },
      {
        id: 121,
        title: "iPhone 5s",
        description: "The iPhone 5s is a classic smartphone known for its compact design and advanced features during its release. While it's an older model, it still provides a reliable user experience."
      },
      {
        id: 122,
        title: "iPhone 6",
        description: "The iPhone 6 is a stylish and capable smartphone with a larger display and improved performance. It introduced new features and design elements, making it a popular choice in its time."
      },
      {
        id: 123,
        title: "iPhone 13 Pro",
        description: "The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display. It offers advanced features for users who demand top-notch technology."
      },
      {
        id: 124,
        title: "iPhone X",
        description: "The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance. It represents a milestone in iPhone design and innovation."
      }
    ],
    total: 23,
    skip: 0,
    limit: 23
  });
}
