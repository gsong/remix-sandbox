import { prisma } from "~/db.server";

export const getTracks = () =>
  prisma.track.findMany({ orderBy: { trackNumber: "asc" } });

export const moveTrackUp = async (id) => {
  const fromTrackNumber = await getTrackNumber(id);

  if (fromTrackNumber === 1) return;

  const toTrackNumber = fromTrackNumber - 1;
  const toTrackId = await getTrackIdFromTrackNumber(toTrackNumber);

  await swapTrackNumbers({
    fromTrackId: id,
    fromTrackNumber,
    toTrackId,
    toTrackNumber,
  });
};

export const moveTrackDown = async (id) => {
  const fromTrackNumber = await getTrackNumber(id);

  const {
    _max: { trackNumber: maxTrackNumber },
  } = await prisma.track.aggregate({
    _max: { trackNumber: true },
  });

  if (fromTrackNumber === maxTrackNumber) return;

  const toTrackNumber = fromTrackNumber + 1;
  const toTrackId = await getTrackIdFromTrackNumber(toTrackNumber);

  await swapTrackNumbers({
    fromTrackId: id,
    fromTrackNumber,
    toTrackId,
    toTrackNumber,
  });
};

const getTrackIdFromTrackNumber = async (trackNumber) => {
  const { id } = await prisma.track.findFirst({
    where: { trackNumber },
    select: { id: true },
  });
  return id;
};

const getTrackNumber = async (id) => {
  const { trackNumber } = await prisma.track.findUnique({
    where: { id },
    select: { trackNumber: true },
  });
  return trackNumber;
};

const swapTrackNumbers = async ({
  fromTrackId,
  fromTrackNumber,
  toTrackId,
  toTrackNumber,
}) => {
  await prisma.$transaction(
    [
      { id: toTrackId, trackNumber: 2147483647 },
      { id: fromTrackId, trackNumber: toTrackNumber },
      { id: toTrackId, trackNumber: fromTrackNumber },
    ].map(({ id, trackNumber }) =>
      prisma.track.update({
        where: { id },
        data: { trackNumber },
      })
    )
  );
};
