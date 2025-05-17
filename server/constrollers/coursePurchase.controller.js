import Stripe from 'stripe';
import { Course } from '../models/course.model.js';
import { CoursePurchase } from '../models/coursePurchase.model.js';
import { Lecture } from '../models/lecture.model.js';
import { User } from '../models/user.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found! "
            });
        }
        // create a new course purchase record in the database
        const newPurchase = new CoursePurchase({
            courseId,
            userId,
            amount: course.coursePrice,
            status: "pending",
        });

        if (typeof course.coursePrice !== 'number' || isNaN(course.coursePrice)) {
            return res.status(400).json({ message: "Invalid or missing course price!" });
        }

        // create a checkout session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: course.courseTitle,
                            // description: course.description,
                            images: [course.courseThumbnail],
                        },
                        // unit_amount: course.coursePrice * 100, // amount in rupees (INR)
                        unit_amount: Math.round(course.coursePrice * 100), // Fixed here

                    },
                    quantity: 1,
                },
            ],
            mode: 'payment', // process.env.FRONTEND_URL,
            success_url: `${process.env.CLIENT_URL}/course-progress/${courseId}/`,
            cancel_url: `${process.env.CLIENT_URL}/course-details/${courseId}/`,
            // success_url: `$http://localhost:5173/course-progress/${courseId}`,
            // cancel_url: `http://localhost:5173/course-detail/${courseId}`,

            metadata: {
                courseId: courseId,
                userId: userId,
            },
            shipping_address_collection: {
                allowed_countries: ['IN'], // optional, specify allowed countries for shipping address
            },
        });
        if (!session.url) {
            return res.status(500).json({
                status: false,
                message: "Error while creating session!"
            });
        }
        // save the purchase record to the database
        newPurchase.paymentId = session.id;
        await newPurchase.save();

        return res.status(200).json({
            status: true,
            // sessionId: session.id,
            url: session.url,// return the stripe checkout session URL
        });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error creating checkout session",
        });
    }
}

// export const stripeWebhook = async (req, res) => {
//   let event;

//   try {
//     const payloadString = JSON.stringify(req.body, null, 2);
//     const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

//     const header = stripe.webhooks.generateTestHeaderString({
//       payload: payloadString,
//       secret,
//     });

//     event = stripe.webhooks.constructEvent(payloadString, header, secret);
//   } catch (error) {
//     console.error("Webhook error:", error.message);
//     return res.status(400).send(`Webhook error: ${error.message}`);
//   }

//   // Handle the checkout session completed event
//   if (event.type === "checkout.session.completed") {
//     console.log("check session complete is called");

//     try {
//       const session = event.data.object;

//       const purchase = await CoursePurchase.findOne({
//         paymentId: session.id,
//       }).populate({ path: "courseId" });

//       if (!purchase) {
//         return res.status(404).json({ message: "Purchase not found" });
//       }

//       if (session.amount_total) {
//         purchase.amount = session.amount_total / 100;
//       }
//       purchase.status = "completed";

//       // Make all lectures visible by setting `isPreviewFree` to true
//       if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//         await Lecture.updateMany(
//           { _id: { $in: purchase.courseId.lectures } },
//           { $set: { isPreviewFree: true } }
//         );
//       }

//       await purchase.save();

//       // Update user's enrolledCourses
//       await User.findByIdAndUpdate(
//         purchase.userId,
//         { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
//         { new: true }
//       );

//       // Update course to add user ID to enrolledStudents
//       await Course.findByIdAndUpdate(
//         purchase.courseId._id,
//         { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
//         { new: true }
//       );
//     } catch (error) {
//       console.error("Error handling event:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
//   res.status(200).send();
// };

export const stripeWebhook = async (req, res) => {
    let event;

    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });
        //     const sig = req.headers['stripe-signature'];
        // const event = stripe.webhooks.constructEvent(req.body, sig, secret);


        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
        console.error("Error verifying webhook signature:", "Webhook error", error);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    // Handle the  checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        console.log("Received Stripe event:", event.type);
        try {
            const session = event.data.object;
            // const courseId = session.metadata.courseId;
            // const userId = session.metadata.userId;
            // const paymentId = session.id;

            const purchase = await CoursePurchase.findOne({
                paymentId: session.id,
            }).populate({ path: 'courseId' });
            if (!purchase) {
                return res.status(404).json({
                    status: false,
                    message: "Purchase not found",
                });
            }
            if (session.amount_total) {
                purchase.amount = session.amount_total / 100; // convert cents to dollars
            }
            purchase.status = "completed";

            // make all Lecture visible by setting 'isPreviewFree' to true
            if (purchase.courseId && purchase.courseId.lectures.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { isPreviewFree: true } }
                );
            };
            // update course to add user Id to enrolledstudents
            await purchase.save();

            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses: purchase.courseId._id } }, // add courseId to enrolledCourses array
                {
                    new: true,
                    // useFindAndModify: false
                }
            );
            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
                { new: true }
            );

            return res.status(200).json({
                status: true,
                message: "Payment successful",
            });

        } catch (error) {
            console.error("Error processing checkout session:", error);
            return res.status(500).json({
                status: false,
                message: "Internal server error stripe webhook",
            });
        }
    };
    // res.status(200).send();
    return res.status(200).json({
        status: true,
        message: "Webhook received",
    });
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const course = await Course.findById(courseId)
            .populate({ path: 'creator' })
            .populate({ path: 'lectures' });

        const purchased = await CoursePurchase.findOne({
            courseId,
            userId,
            status: "completed",
        });

        if (!course) {
            return res.status(404).json({
                status: false,
                message: "Course not found",
            });
        }
        return res.status(200).json({
            status: true,
            message: "Course details fetched successfully",
            course,
            purchased: purchased ? true : false, // 

        });

    } catch (error) {
        console.error("Error fetching course details:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
}

export const getAllPurchasedCourse = async (_, res) => {
    try {
        const purchasedCourse = await CoursePurchase.find({
            status: "completed"
        }).populate({ path: 'courseId' })
        if (!purchasedCourse) {
            return res.status(404).json({
                purchasedCourse: [],
            })
        }
        return res.status(200).json({
            status: true,
            message: "Purchased courses fetched successfully",
            purchasedCourse,
        });

    } catch (error) {
        console.error("Error fetching purchased courses:", error);
    }
}