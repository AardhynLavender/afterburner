import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import { SUCCESS, INTERNAL_SERVER_ERROR } from "./constants/http";
import { log, error } from "./util/log";
import admin, { firestore } from "firebase-admin";
import { generateSignedUrl } from "./storage";

admin.initializeApp();

const corsHandler = cors({ origin: true });

export const claimTicket = onRequest(async (request, response) => {
  const { ticketId } = request.body.data;
  try {
    if (!ticketId) throw new Error("No ticketId provided");

    log(`claiming ticket: \`${ticketId}\``);

    const ticketRef = firestore().collection("ticket").doc(ticketId);
    const ticketDoc = await ticketRef.get();
    const ticket = ticketDoc.data();

    log(`ticket: \`${JSON.stringify(ticket)}\``);
    if (!ticket) {
      log("Ticket not found");
      return corsHandler(request, response, () => {
        response.status(SUCCESS).send(
          JSON.stringify({
            data: {
              ticketId: ticketId,
              status: "not_found",
              error: null,
            },
          })
        );
      });
    }

    if (ticket.claimed) {
      log("Ticket already claimed");
      return corsHandler(request, response, () => {
        response.status(SUCCESS).send(
          JSON.stringify({
            data: {
              ticketId: ticketId,
              status: "already_claimed",
              error: null,
            },
          })
        );
      });
    }

    await ticketRef.update({ claimed: true });
    log("Ticket claimed successfully");

    return corsHandler(request, response, () => {
      response.status(SUCCESS).send(
        JSON.stringify({
          data: {
            ticketId: ticketId,
            status: "claimed",
            error: null,
          },
        })
      );
    });
  } catch (e) {
    error(`error: \`${JSON.stringify(e)}\``);
    return corsHandler(request, response, () => {
      response.status(INTERNAL_SERVER_ERROR).send(
        JSON.stringify({
          data: {
            ticketId: ticketId,
            status: "error",
            error: e,
          },
        })
      );
    });
  }
});

export const getShowData = onRequest(async (request, response) => {
  try {
    const { showingId, ticketId } = request.body.data;
    if (!showingId) throw new Error("No `showingId` provided");
    if (!ticketId) throw new Error("No `ticketId` provided");

    // validate ticket
    const ticketRef = firestore().collection("ticket").doc(ticketId);
    const ticketSnapshot = await ticketRef.get();
    const ticket = ticketSnapshot.data();
    log(`validating ticket \`${ticketId}\``);
    if (!ticket?.claimed) {
      if (!ticket) log(`ticket not found!`);
      else log(`ticket not claimed!`);
      // this is unclaimed or non-existent ticket
      // (don't reveal to the user that the ticket was unclaimed...)
      return corsHandler(request, response, () => {
        response.status(SUCCESS).send(
          JSON.stringify({
            data: {
              chapters: null,
              show: null,
              showing: null,
              status: "invalid_ticket",
              error: null,
            },
          })
        );
      });
    }

    // get showing
    const showingRef = firestore().collection("showing").doc(showingId);
    const showingSnapshot = await showingRef.get();
    const showing = showingSnapshot.data();
    if (!showing)
      // failed to find the showing
      return corsHandler(request, response, () => {
        response.status(SUCCESS).send(
          JSON.stringify({
            data: {
              chapters: null,
              show: null,
              showing: null,
              status: "invalid_showing",
              error: null,
            },
          })
        );
      });

    // get show
    const showRef = firestore().collection("show").doc(showing.showId);
    const showSnapshot = await showRef.get();
    const show = showSnapshot.data();
    if (!show)
      // failed to find the show
      return corsHandler(request, response, () => {
        response.status(SUCCESS).send(
          JSON.stringify({
            data: {
              chapters: null,
              show: null,
              showing: null,
              status: "invalid_show",
              error: null,
            },
          })
        );
      });

    // get chapters
    const chaptersSnapshot = await showRef.collection("chapter").get();
    log(`preparing chapters for \`${show.slug}\``);
    const chapters = await Promise.all(
      chaptersSnapshot.docs.map(async (doc) => {
        const chapter = doc.data() as { id: number; [key: string]: any };

        // create a signed url for the audio file so the user can download|stream it
        const audioFilePath = `${show.slug}/${chapter.fileName}`;
        const audioFileUrl = await generateSignedUrl(audioFilePath);

        return { ...chapter, audioFileUrl };
      })
    );

    const sortedChapters = chapters.sort((a, b) => a.id - b.id);

    return corsHandler(request, response, () => {
      response.status(SUCCESS).send(
        JSON.stringify({
          data: {
            status: "success",
            error: null,
            showing,
            show,
            chapters: sortedChapters,
            ticket,
          },
        })
      );
    });
  } catch (e) {
    if (e instanceof Error) error(e.message);
    else error(`An unknown error occurred: ${JSON.stringify(e)}`);

    return corsHandler(request, response, () => {
      response.status(INTERNAL_SERVER_ERROR).send(
        JSON.stringify({
          data: {
            status: "error",
            error: e,
            showing: null,
            show: null,
            chapters: null,
            ticket: null,
          },
        })
      );
    });
  }
});
