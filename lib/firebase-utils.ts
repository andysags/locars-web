import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
  User,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
  Firestore,
  DocumentSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

// User registration types
export interface ParticulierRegistrationData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseCountry: string;
  identityDocument: File;
  drivingLicense: File;
}

export interface AgenceRegistrationData {
  email: string;
  phone: string;
  password: string;
  agencyName: string;
  representativeFirstName: string;
  representativeLastName: string;
  agencyAddress: string;
  professionalEmail: string;
  professionalPhone: string;
  ifuNumber?: string;
  identityDocument: File;
  commercialRegistry: File;
  ifuAttestation: File;
}

export type RegistrationData =
  | ParticulierRegistrationData
  | AgenceRegistrationData;

// Auth functions
export const registerUser = async (
  auth: Auth,
  email: string,
  password: string,
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
};

export const loginUser = async (
  auth: Auth,
  email: string,
  password: string,
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
};

export const logoutUser = async (auth: Auth): Promise<void> => {
  await signOut(auth);
};

// Document upload to Cloud Storage
export const uploadDocument = async (
  storage: FirebaseStorage,
  userId: string,
  documentType: string,
  file: File,
): Promise<string> => {
  const fileName = `${documentType}-${Date.now()}-${file.name}`;
  const fileRef = ref(storage, `user-documents/${userId}/${fileName}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

// Firestore CRUD for Host Requests
export const createHostRequest = async (
  firestore: Firestore,
  userId: string,
  hostType: "particulier" | "agence",
  data: RegistrationData,
  documentUrls: Record<string, string>,
): Promise<string> => {
  // Create a clean object without File instances
  const cleanData: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (!(value instanceof File)) {
      cleanData[key] = value;
    }
  });

  const hostRequestData = {
    userId,
    hostType,
    status: "PENDING", // PENDING, APPROVED, REJECTED
    createdAt: new Date(),
    updatedAt: new Date(),
    ...cleanData,
    documentUrls,
  };

  const docRef = await addDoc(
    collection(firestore, "host_requests"),
    hostRequestData,
  );
  return docRef.id;
};

// Get all host requests (for admin dashboard)
export const getHostRequests = async (
  firestore: Firestore,
  status?: string,
): Promise<any[]> => {
  let q;
  if (status) {
    q = query(
      collection(firestore, "host_requests"),
      where("status", "==", status),
    );
  } else {
    q = query(collection(firestore, "host_requests"));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update host request status (approve/reject)
export const updateHostRequestStatus = async (
  firestore: Firestore,
  hostRequestId: string,
  status: "APPROVED" | "REJECTED",
  reason?: string,
): Promise<void> => {
  const hostRequestRef = doc(firestore, "host_requests", hostRequestId);
  await updateDoc(hostRequestRef, {
    status,
    updatedAt: new Date(),
    reason: reason || null,
  });
};

// Get popular cars (approved, sorted by rating)
export const getPopularCars = async (
  firestore: Firestore,
  limit: number = 4,
): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "cars"));
    const cars = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((car: any) => car.rating && car.brand && car.model) as any[];

    // Sort by rating descending
    cars.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));

    // Return limited results
    return cars.slice(0, limit);
  } catch (err) {
    console.error("Error fetching popular cars:", err);
    return [];
  }
};

// Get all cars (for admin dashboard)
export const getAllCars = async (
  firestore: Firestore,
  status?: "PENDING" | "APPROVED" | "REJECTED",
): Promise<any[]> => {
  let q;
  if (status) {
    q = query(
      collection(firestore, "cars"),
      where("isApproved", "==", status === "APPROVED"),
    );
  } else {
    q = query(collection(firestore, "cars"));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update car approval status
export const updateCarStatus = async (
  firestore: Firestore,
  carId: string,
  isApproved: boolean,
): Promise<void> => {
  const carRef = doc(firestore, "cars", carId);
  await updateDoc(carRef, {
    isApproved,
    updatedAt: new Date(),
  });
};

// Get all users (for admin dashboard)
export const getAllUsers = async (
  firestore: Firestore,
  hostType?: "particulier" | "agence",
): Promise<any[]> => {
  let q;
  if (hostType) {
    q = query(
      collection(firestore, "users"),
      where("hostType", "==", hostType),
    );
  } else {
    q = query(collection(firestore, "users"));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update user approval status
export const updateUserStatus = async (
  firestore: Firestore,
  userId: string,
  isApproved: boolean,
): Promise<void> => {
  const userRef = doc(firestore, "users", userId);
  await updateDoc(userRef, {
    isApproved,
    updatedAt: new Date(),
  });
};

// Get dashboard statistics
export const getDashboardStats = async (firestore: Firestore): Promise<any> => {
  const hostRequestsSnapshot = await getDocs(
    collection(firestore, "host_requests"),
  );
  const usersSnapshot = await getDocs(collection(firestore, "users"));
  const carsSnapshot = await getDocs(collection(firestore, "cars"));

  const pendingRequests = hostRequestsSnapshot.docs.filter(
    (doc) => doc.data().status === "PENDING",
  );
  // Only count cars with isApproved === false (explicitly not approved)
  const pendingCars = carsSnapshot.docs.filter(
    (doc) => doc.data().isApproved === false,
  );
  const approvedUsers = usersSnapshot.docs.filter(
    (doc) => doc.data().isApproved,
  );
  const siteRequests = hostRequestsSnapshot.docs.filter(
    (doc) => doc.data().source === "website",
  );

  return {
    pendingAccounts: pendingRequests.length,
    pendingVehicles: pendingCars.length,
    activeRenters: approvedUsers.length,
    siteRequests: siteRequests.length,
  };
};

// Get contact form inquiries
export const getInquiries = async (firestore: Firestore): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "inquiries"));
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    return docs.sort((a, b) => {
      try {
        const dateA =
          a?.createdAt?.toDate?.() || new Date(a?.createdAt) || new Date(0);
        const dateB =
          b?.createdAt?.toDate?.() || new Date(b?.createdAt) || new Date(0);
        return dateB.getTime() - dateA.getTime();
      } catch {
        return 0;
      }
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    return [];
  }
};

// Update inquiry status
export const updateInquiryStatus = async (
  firestore: Firestore,
  inquiryId: string,
  status: string,
): Promise<void> => {
  const inquiryRef = doc(firestore, "inquiries", inquiryId);
  await updateDoc(inquiryRef, {
    status,
    updatedAt: new Date(),
  });
};

// Get all reviews/ratings
export const getReviews = async (firestore: Firestore): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "reviews"));
    return querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        const dateA =
          a?.createdAt?.toDate?.() || new Date(a?.createdAt) || new Date(0);
        const dateB =
          b?.createdAt?.toDate?.() || new Date(b?.createdAt) || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return [];
  }
};

// Delete a review
export const deleteReview = async (
  firestore: Firestore,
  reviewId: string,
): Promise<void> => {
  const reviewRef = doc(firestore, "reviews", reviewId);
  await updateDoc(reviewRef, {
    deletedAt: new Date(),
    isDeleted: true,
  });
};

// Update review (approve/moderate)
export const updateReview = async (
  firestore: Firestore,
  reviewId: string,
  data: Record<string, any>,
): Promise<void> => {
  const reviewRef = doc(firestore, "reviews", reviewId);
  await updateDoc(reviewRef, {
    ...data,
    updatedAt: new Date(),
  });
};

// Send warning for a review
export const sendReviewWarning = async (
  firestore: Firestore,
  reviewId: string,
  renterName: string,
  renterEmail: string,
  reason: string,
): Promise<void> => {
  try {
    await addDoc(collection(firestore, "review_warnings"), {
      reviewId,
      renterName,
      renterEmail,
      reason,
      sentAt: new Date(),
      status: "sent",
    });

    // Also mark the review as warned
    const reviewRef = doc(firestore, "reviews", reviewId);
    await updateDoc(reviewRef, {
      hasWarning: true,
      warningDate: new Date(),
    });
  } catch (err) {
    console.error("Error sending review warning:", err);
    throw err;
  }
};

// Get all reservations
export const getReservations = async (firestore: Firestore): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "reservations"));
    return querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        const dateA =
          a?.createdAt?.toDate?.() || new Date(a?.createdAt) || new Date(0);
        const dateB =
          b?.createdAt?.toDate?.() || new Date(b?.createdAt) || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
  } catch (err) {
    console.error("Error fetching reservations:", err);
    return [];
  }
};

// Get single reservation
export const getReservation = async (
  firestore: Firestore,
  reservationId: string,
): Promise<any> => {
  try {
    const reservationRef = doc(firestore, "reservations", reservationId);
    const docSnap = await getDoc(reservationRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (err) {
    console.error("Error fetching reservation:", err);
    return null;
  }
};

// Update reservation status
export const updateReservationStatus = async (
  firestore: Firestore,
  reservationId: string,
  status: string,
): Promise<void> => {
  const reservationRef = doc(firestore, "reservations", reservationId);
  await updateDoc(reservationRef, {
    status,
    updatedAt: new Date(),
  });
};

// Analytics & Rentability Functions

// Get real revenue analytics from host_transactions collection (in XOF - CFA Francs)
export const getRevenueAnalytics = async (
  firestore: Firestore,
): Promise<{
  totalTransactions: number;
  totalRevenue: number;
  totalLocarsCommission: number;
  totalHostEarnings: number;
  completedTransactions: number;
  pendingTransactions: number;
  averageOrderValue: number;
  monthlyRevenue: { month: string; commission: number; hostEarnings: number }[];
  currency: string;
}> => {
  try {
    // Fetch all host transactions from Firestore (real data)
    const querySnapshot = await getDocs(
      collection(firestore, "host_transactions"),
    );
    const allTransactions = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Calculate basic stats
    const totalTransactions = allTransactions.length;
    const completedTransactions = allTransactions.filter(
      (t: any) => t.status?.toLowerCase() === "completed",
    ).length;
    const pendingTransactions = allTransactions.filter(
      (t: any) => t.status?.toLowerCase() === "pending",
    ).length;

    // Sum commissions and earnings (in XOF - CFA Francs)
    const totalLocarsCommission = allTransactions.reduce(
      (acc: number, t: any) => acc + (t.locarsCommission || 0),
      0,
    );
    const totalHostEarnings = allTransactions.reduce(
      (acc: number, t: any) => acc + (t.netAmount || 0),
      0,
    );
    const totalRevenue = totalLocarsCommission + totalHostEarnings;

    const averageOrderValue =
      totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Monthly revenue breakdown
    const monthlyData: {
      [key: string]: { commission: number; hostEarnings: number };
    } = {};
    allTransactions.forEach((trans: any) => {
      if (trans.createdAt) {
        const date = trans.createdAt.toDate
          ? trans.createdAt.toDate()
          : new Date(trans.createdAt);
        const monthKey = date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "2-digit",
        });
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { commission: 0, hostEarnings: 0 };
        }
        monthlyData[monthKey].commission += trans.locarsCommission || 0;
        monthlyData[monthKey].hostEarnings += trans.netAmount || 0;
      }
    });

    const monthlyRevenue = Object.entries(monthlyData)
      .sort()
      .map(([month, data]) => ({
        month,
        commission: data.commission,
        hostEarnings: data.hostEarnings,
      }));

    return {
      totalTransactions,
      totalRevenue,
      totalLocarsCommission,
      totalHostEarnings,
      completedTransactions,
      pendingTransactions,
      averageOrderValue,
      monthlyRevenue,
      currency: "XOF", // CFA Francs
    };
  } catch (err) {
    console.error("Error fetching revenue analytics:", err);
    return {
      totalTransactions: 0,
      totalRevenue: 0,
      totalLocarsCommission: 0,
      totalHostEarnings: 0,
      completedTransactions: 0,
      pendingTransactions: 0,
      averageOrderValue: 0,
      monthlyRevenue: [],
      currency: "XOF",
    };
  }
};

// Get host commissions from host_transactions (real data in XOF)
export const getHostCommissions = async (
  firestore: Firestore,
): Promise<any[]> => {
  try {
    const transactionsSnapshot = await getDocs(
      collection(firestore, "host_transactions"),
    );
    const usersSnapshot = await getDocs(collection(firestore, "users"));

    const transactions = transactionsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    const users = usersSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Group transactions by host
    const hostCommissions: { [key: string]: any } = {};

    transactions.forEach((trans: any) => {
      const hostId = trans.hostId;
      if (!hostId) return;

      if (!hostCommissions[hostId]) {
        const host = users.find((u: any) => u.id === hostId);
        hostCommissions[hostId] = {
          hostId,
          hostName:
            host?.agencyName ||
            `${host?.firstName} ${host?.lastName}` ||
            "Unknown",
          email: host?.email || "",
          totalLocarsCommission: 0,
          totalHostEarnings: 0,
          totalRevenue: 0,
          transactionCount: 0,
          completedCount: 0,
          pendingCount: 0,
          transactions: [],
          currency: "XOF",
        };
      }

      // Add real commission and earnings from Firestore
      hostCommissions[hostId].totalLocarsCommission +=
        trans.locarsCommission || 0;
      hostCommissions[hostId].totalHostEarnings += trans.netAmount || 0;
      hostCommissions[hostId].totalRevenue +=
        (trans.locarsCommission || 0) + (trans.netAmount || 0);
      hostCommissions[hostId].transactionCount += 1;

      if (trans.status?.toLowerCase() === "completed") {
        hostCommissions[hostId].completedCount += 1;
      } else if (trans.status?.toLowerCase() === "pending") {
        hostCommissions[hostId].pendingCount += 1;
      }

      hostCommissions[hostId].transactions.push({
        id: trans.id,
        orderId: trans.orderId,
        locarsCommission: trans.locarsCommission || 0,
        hostEarnings: trans.netAmount || 0,
        totalAmount: (trans.locarsCommission || 0) + (trans.netAmount || 0),
        status: trans.status,
        date: trans.createdAt,
      });
    });

    return Object.values(hostCommissions).sort(
      (a: any, b: any) => b.totalHostEarnings - a.totalHostEarnings,
    );
  } catch (err) {
    console.error("Error fetching host commissions:", err);
    return [];
  }
};

// Get commission history (transaction logs)
export const getCommissionHistory = async (
  firestore: Firestore,
): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(
      collection(firestore, "commissionHistory"),
    );
    return querySnapshot.docs
      .map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        const dateA =
          a?.createdAt?.toDate?.() || new Date(a?.createdAt) || new Date(0);
        const dateB =
          b?.createdAt?.toDate?.() || new Date(b?.createdAt) || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
  } catch (err) {
    console.error("Error fetching commission history:", err);
    return [];
  }
};

// Record commission payment
export const recordCommissionPayment = async (
  firestore: Firestore,
  hostId: string,
  amount: number,
  paymentMethod: string,
): Promise<void> => {
  try {
    await addDoc(collection(firestore, "commissionHistory"), {
      hostId,
      amount,
      type: "payment",
      paymentMethod,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Error recording commission payment:", err);
    throw err;
  }
};

// Get all host transactions (for detailed history)
export const getHostTransactionHistory = async (
  firestore: Firestore,
  hostId?: string,
): Promise<any[]> => {
  try {
    let q: any;
    if (hostId) {
      q = query(
        collection(firestore, "host_transactions"),
        where("hostId", "==", hostId),
      );
    } else {
      q = collection(firestore, "host_transactions");
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        const dateA =
          a?.createdAt?.toDate?.() || new Date(a?.createdAt) || new Date(0);
        const dateB =
          b?.createdAt?.toDate?.() || new Date(b?.createdAt) || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
  } catch (err) {
    console.error("Error fetching host transaction history:", err);
    return [];
  }
};
