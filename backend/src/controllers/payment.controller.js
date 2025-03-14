const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 

const User = require('../models/user.model');

// ----------------------- Buy Course Using Stripe -----------------------
const buyCourseUsingStripe = async (thumbnailUrl, userId) => {
  try {
      const buyer = await User.findById(userId);
      if (!buyer) return console.error("❌ User not found in database");

      const decodedThumbnail = decodeURIComponent(thumbnailUrl);

      const seller = await User.findOne(
          { "yourCourse.thumbnailUrl": { $regex: new RegExp(`^${decodedThumbnail}$`, "i") } },
          { "yourCourse.$": 1 } // Fetch only the matching course
      );

      if (!seller || !seller.yourCourse.length) {
          return console.error("❌ Course not found");
      }

      const courseToBuy = seller.yourCourse[0];

      // Check if the buyer already owns the course
      const alreadyPurchased = buyer.coursesBuyied.some(course => course.thumbnailUrl === courseToBuy.thumbnailUrl);
      if (alreadyPurchased) return console.error("⚠️ User has already purchased this course");

      // Add course to the buyer's purchased list
      
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $push: { coursesBuyied: courseToBuy } },
          { new: true }
      );
      console.log("✅ Course purchased successfully!");
      if(!updatedUser) console.log("❌ Course purchased failed!");
  } catch (error) {
      console.error("❌ Error buying course:", error);
  }
};

// ----------------------- Add Balance Using Stripe -----------------------
const addBalanceUsingStripe = async(userId , amount) => {
  try {
    const user = await User.findByIdAndUpdate(
          userId , {
            $inc : { wallet : amount},
          },{ new: true }
    )
    if(!user) return console.error("❌ User Not Found");

    console.log(`✅ Successfully added ₹${amount} to your wallet`);
  } catch (error) {
    console.error("❌ Error adding funds:", error);
  }
}

// ----------------------- Course Payment Checkout -----------------------
const checkOut = async (req, res) => {
  const { price, videoUrl } = req.body;
  const userId = req.user.userId;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Course Purchase" },
            unit_amount: price * 100, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/coursepage/${videoUrl}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/coursepage/${videoUrl}?canceled=true`,
      metadata: { videoUrl, userId }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ----------------------- Handling Webhooks -----------------------
const handlingWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const thumbnailUrl = session.metadata?.videoUrl;
      const userId = session.metadata?.userId;

      if (!thumbnailUrl || !userId) {
          console.error("❌ Missing thumbnailUrl or userId in metadata");
          return res.status(400).json({ error: "Missing metadata" });
      }

      try {
          await buyCourseUsingStripe(thumbnailUrl, userId);
      } catch (error) {
          console.error("🚨 Error processing purchase:", error);
          return res.status(500).json({ error: "Failed to process purchase" });
      }
  }

  res.json({ received: true });
};

// ----------------------- Add Balance Checkout -----------------------
const addBalance = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Wallet Money" },
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/profile?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/profile?canceled=true`,
      metadata: { userId , amount }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ----------------------- Add Balance Webhook -----------------------
const addBalanceWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]; 

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId; 
      const amount = session.metadata.amount;

      if (!userId) {
          console.error("❌ Missing UserId in metadata");
          return res.status(400).json({ error: "Missing metadata" });
      }

      await addBalanceUsingStripe(userId, amount); 
  }

  res.json({ received: true });
};

module.exports = { checkOut , handlingWebhook , addBalance , addBalanceWebhook };
