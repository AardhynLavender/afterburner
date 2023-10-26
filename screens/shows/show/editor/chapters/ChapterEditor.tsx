import React, {
  DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  useChapterGetQuery,
  useChapterMutation,
} from "../../../../../api/chapter";
import {
  Chapter,
  Identity,
  ImageInteraction,
  Interaction,
  InteractionTypes,
  NextChapterInteraction,
  Show,
} from "../../../../../api/types";
import Button from "../../../../../components/ui/Button";
import { NumberField, TextField } from "../../../../../components/ui/TextField";
import { invariant } from "../../../../../exception/invariant";
import { ChapterEditorScreenProps } from "../../../../../navigation";
import * as DocumentPicker from "expo-document-picker";
import { uploadFile, getFileUrl } from "../../../../../api/firebase";
import useSound from "../../../../../sound/sound";
import { useAsyncEffect } from "../../../../../util/async";
import Fi from "react-native-vector-icons/Feather";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { percent } from "../../../../../util/math";
import {
  msToTimestamp,
  msToMinutes,
  MINUTE_S,
  HOUR_M,
  msToHours,
  msToSeconds,
  MAX_MINUTE_SECONDS,
  destructuredTimeToMs,
} from "../../../../../util/time";
import { capitalize } from "../../../../../util/string";
import { MAX_HOUR_MINUTES } from "../../../../../util/time";
import SelectDropdown from "react-native-select-dropdown";
import { defined } from "../../../../../util/value";
import { TimePicker } from "../../../../../components/ui/Time";
import { HeroInteraction } from "../../../../../api/types";

const FILES_PER_CHAPTER = 1;
const UNTITLED_CHAPTER = "Untitled Chapter";

export default function ChapterEditor({
  route,
}: ChapterEditorScreenProps<"chapter">) {
  const { show, chapterId } = route.params;
  invariant(show, "`show` is required");

  const { chapter, loading } = useChapterGetQuery(show.id, chapterId);
  if (loading || !chapter) return <Text>Loading...</Text>;

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>"{chapter.title}" Details</Text>
        <ChapterDetails chapter={chapter} show={show} />

        <Text style={styles.heading}>Interactions</Text>
        <ChapterAudio chapter={chapter} show={show} />
        <ChapterInteractions chapter={chapter} show={show} />
      </View>
    </ScrollView>
  );
}

function ChapterDetails({
  chapter,
  show,
}: {
  chapter: Chapter;
  show: Show & Identity;
}) {
  const { mutateChapter, loading: chapterMutating } = useChapterMutation();

  // Chapter details
  const [title, setTitle] = useState(chapter?.title);
  const [description, setDescription] = useState(chapter?.description);
  const handleBlur = async (mutation: Partial<Chapter>) => {
    invariant(chapter, "`chapter` is required");
    mutateChapter(show.id, chapter.id, mutation);
  };
  useEffect(() => {
    if (!chapter) return;
    setTitle(chapter.title);
    setDescription(chapter.description);
  }, [chapter]);

  return (
    <View style={{ gap: 16 }}>
      {chapterMutating && <Text>Loading...</Text>}
      <TextField
        label="Title"
        placeholder="chapter title"
        value={title}
        onChangeText={setTitle}
        onBlur={() => handleBlur({ title })}
      />
      <TextField
        label="Description"
        placeholder="chapter description"
        value={description}
        onChangeText={setDescription}
        onBlur={() => handleBlur({ description })}
      />
    </View>
  );
}

function ChapterAudio({
  chapter,
  show,
}: {
  chapter: Chapter;
  show: Show & Identity;
}) {
  // File upload|change
  const { mutateChapter, loading: chapterMutating } = useChapterMutation();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const handleUpload = async () => {
    invariant(chapter, "`chapter` is required");

    // reset state
    setUploading(true);
    setSuccess(false);
    setError(null);

    // pick a file using the document picker
    const { assets, canceled } = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });
    if (canceled) return;
    invariant(assets.length === FILES_PER_CHAPTER, "Expected one file");
    const [asset] = assets;

    // upload the file to firebase storage
    try {
      const path = `${show.slug}/${asset.name}`;
      await uploadFile(asset.uri, path); // upload file to firebase
      await mutateChapter(show.id, chapter.id, { fileName: asset.name }); // update chapter audio filename in firestore
      setSuccess(true);
    } catch (error) {
      setError(error as Error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.fileZone}>
      {chapter.fileName ? (
        <>
          <Text style={styles.pill}>{chapter.fileName}</Text>
          <Button onPress={handleUpload}>Change</Button>
        </>
      ) : (
        <>
          <Text>No file uploaded</Text>
          <Button onPress={handleUpload}>Upload</Button>
        </>
      )}
      {uploading && <Text>Uploading...</Text>}
      {success && <Text style={{ color: "#0f0" }}>Success!</Text>}
      {error && <Text style={{ color: "#f00" }}>{error.message}!</Text>}
    </View>
  );
}

const AUTOPLAY = false;
const START_MS = 0; // todo: remember the chapter being edited and calculate the start ms from that.
const SEEK_INCREMENT_MS = 3000;

function ChapterInteractions({
  chapter,
  show,
}: {
  chapter: Chapter;
  show: Show & Identity;
}) {
  const { mutateChapter } = useChapterMutation();
  const [selected, setSelected] = useState<number>();
  const [position, setPosition] = useState<number | null>(null);

  const interactions = chapter.interactions || [];

  const handleAddInteraction = (interaction: Interaction) => {
    const newInteraction = [...interactions, interaction];
    mutateChapter(show.id, chapter.id, { interactions: newInteraction });
  };
  const handleRemoveInteraction = async () => {
    const newInteraction = interactions.filter(
      (_, index) => index !== selected
    );
    await mutateChapter(show.id, chapter.id, { interactions: newInteraction });
    setSelected(undefined);
  };
  const handleMutateInteraction =
    (index: number) => (mutation: Partial<Interaction>) => {
      invariant(
        index >= 0 && index < interactions.length,
        "Index out of bounds"
      );

      const newInteractions = interactions.map((interaction, i) =>
        i === index
          ? ({ ...interaction, ...mutation } as Interaction)
          : interaction
      );

      mutateChapter(show.id, chapter.id, { interactions: newInteractions });
    };

  // get the file url
  const uri = `${show.slug}/${chapter.fileName}`;
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    (async () => {
      try {
        const url = await getFileUrl(uri);
        setUrl(url);
      } catch (error) {
        console.log(error || "Unknown error");
      }
    })();
  }, [uri]);

  const { isLoaded, playing, duration, error, play, pause, set } = useSound(
    url,
    {
      autoPlay: AUTOPLAY,
      onTick: setPosition,
      position: position ?? START_MS,
    }
  );

  if (!isLoaded) return <Text>Loading audio file...</Text>;

  const handleReset = () => set(0);
  const handlePlayToggle = () => (playing ? pause() : play());
  const handleSeek = (ms: number) => () => set((position ?? START_MS) + ms);

  const handleSelectionChange = (index: number) => {
    invariant(interactions, "`interactions` is required to set selected");
    invariant(
      index < interactions.length && index >= 0,
      `\`${index}\` is out of bounds for \`interactions\``
    );
    setSelected(index);
    set(interactions[index].start_timestamp ?? START_MS);
  };

  return (
    <View>
      {error && <Text>Error: {error.message}</Text>}
      <View style={{ gap: 16 }}>
        <Text style={styles.timestamp}>{chapter.fileName}</Text>
        <Text style={styles.timestamp}>
          {msToTimestamp(position ?? START_MS)} - {msToTimestamp(duration)}
        </Text>
        <View style={styles.playbackControls}>
          <Button onPress={handleReset} variant="stealth" disabled={!position}>
            <Fi name="skip-back" />
          </Button>
          <Button onPress={handleSeek(-SEEK_INCREMENT_MS)} variant="stealth">
            <Fi name="rewind" />
          </Button>
          <Button onPress={handlePlayToggle} variant="stealth">
            {playing ? <Fi name="pause" /> : <Fi name="play" />}
          </Button>
          <Button onPress={handleSeek(SEEK_INCREMENT_MS)} variant="stealth">
            <Fi name="fast-forward" />
          </Button>
        </View>
        {!!interactions.length && !!duration && (
          <InteractionList
            interactions={interactions}
            fileDurationMs={duration}
            position={position ?? START_MS}
            selected={selected}
            onSelectedChange={handleSelectionChange}
          />
        )}

        <Text style={styles.heading2}>Edit Interaction</Text>
        {defined(selected) ? (
          <>
            <InteractionEditor
              key={selected}
              interaction={interactions[selected]}
              fileDurationMs={duration}
              onInteractionRemove={handleRemoveInteraction}
              onInteractionChange={handleMutateInteraction(selected)}
            />
          </>
        ) : (
          <View style={{ gap: 16 }}>
            <Text style={{ color: "#444", textAlign: "center" }}>
              No interaction selected
            </Text>
          </View>
        )}

        <Text style={styles.heading2}>Add Interaction</Text>
        <AddInteraction onAdd={handleAddInteraction} />
      </View>
    </View>
  );
}

/**
 * convert relative interaction timestamps to absolute timestamps
 * (negative values are relative to the end of the file)
 */
function getAbsoluteInteractionTimestamps(
  start: number | undefined,
  end: number | undefined,
  duration: number
) {
  const startRelative = start ?? 0;
  const endRelative = end ?? duration;

  const startAbsolute =
    startRelative >= 0 ? startRelative : duration + startRelative;
  const endAbsolute = endRelative >= 0 ? endRelative : duration + endRelative;

  invariant(startAbsolute <= endAbsolute, "`start` must be before `end`");
  invariant(startAbsolute >= 0, "start must be positive");
  invariant(endAbsolute <= duration, "end must be less than file duration");

  return [startAbsolute, endAbsolute] as const;
}

function InteractionList({
  interactions,
  fileDurationMs,
  position,
  selected,
  onSelectedChange,
}: {
  interactions: Interaction[];
  fileDurationMs: number;
  position: number;
  selected?: number;
  onSelectedChange: (index: number) => void;
}) {
  const handleInteractionPress = (index: number) => () =>
    onSelectedChange(index);

  return (
    <View style={styles.interactionList}>
      {interactions.map((interaction, index) => (
        <InteractionRow
          key={index}
          position={position}
          interaction={interaction}
          selected={index === selected}
          fileDurationMs={fileDurationMs}
          onPress={handleInteractionPress(index)}
        />
      ))}
    </View>
  );
}

const UNTITLED_INTERACTION = "Untitled Interaction";

function InteractionRow({
  interaction,
  position,
  selected,
  onPress,
  fileDurationMs,
}: {
  interaction: Interaction;
  position: number;
  selected: boolean;
  fileDurationMs: number;
  onPress: () => void;
}) {
  const [start, end] = useMemo(
    () =>
      getAbsoluteInteractionTimestamps(
        interaction.start_timestamp,
        interaction.end_timestamp,
        fileDurationMs
      ),
    [interaction.start_timestamp, interaction.end_timestamp, fileDurationMs]
  );

  return (
    <View style={styles.interaction}>
      <View style={styles.interactionInfo}>
        <Text>{interaction?.name ?? UNTITLED_INTERACTION}</Text>
        <Text style={styles.pill}>{capitalize(interaction.type)}</Text>
      </View>
      <TouchableHighlight onPress={onPress}>
        <View style={styles.interactionTimeline}>
          <View
            style={{
              ...styles.interactionCursor,
              left: percent(position / fileDurationMs),
            }}
          />
          <View
            style={{
              ...styles.interactionNode,
              marginLeft: percent(start / fileDurationMs),
              width: percent((end - start) / fileDurationMs),
            }}
          >
            <Text numberOfLines={1} style={styles.interactionNodeText}>
              {msToTimestamp(start)}
            </Text>
            <Text numberOfLines={1} style={styles.interactionNodeText}>
              {msToTimestamp(end)}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
}

function AddInteraction({
  onAdd: onCreate,
}: {
  onAdd: (interaction: Interaction) => void;
}) {
  const [interaction, setInteraction] = useState<Interaction>({
    type: DEFAULT_INTERACTION_TYPE,
  } as Interaction);
  return (
    <View style={styles.createInteraction}>
      <InteractionEditor
        interaction={interaction}
        onInteractionChange={(mutation) =>
          setInteraction({ ...interaction, ...mutation } as Interaction)
        }
      />
      <Button onPress={() => interaction && onCreate(interaction)}>
        Create
      </Button>
    </View>
  );
}

type EditorProps<T extends Interaction = Interaction> = {
  interaction?: T;
  onInteractionChange: (interaction: Partial<T>) => void;
  onInteractionRemove?: () => void;
};

const DEFAULT_INTERACTION_TYPE = "hero";
function InteractionEditor({
  interaction,
  fileDurationMs = 0,
  onInteractionChange,
  onInteractionRemove,
}: { fileDurationMs?: number } & EditorProps) {
  const [error, setError] = useState<string>();
  const [name, setName] = useState(interaction?.name ?? "");
  const [type, setType] = useState(
    interaction?.type ?? DEFAULT_INTERACTION_TYPE
  );

  const [start, setStart] = useState(interaction?.start_timestamp);
  const [end, setEnd] = useState(interaction?.end_timestamp);

  const handleStartChange = (ms: number) => {
    setStart(ms);
    setError(undefined);
    try {
      getAbsoluteInteractionTimestamps(ms, end, fileDurationMs);
      onInteractionChange({ start_timestamp: ms });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid timestamp");
    }
  };

  const handleEndChange = (ms: number) => {
    setEnd(ms);
    setError(undefined);
    try {
      getAbsoluteInteractionTimestamps(start, ms, fileDurationMs);
      onInteractionChange({ end_timestamp: ms });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid timestamp");
    }
  };

  return (
    <View style={styles.activeInteraction}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {defined(error) && <Text style={{ color: "#800" }}>{error}</Text>}
        {/* Generic Fields */}
        <SelectDropdown
          data={InteractionTypes as any}
          defaultValue={type}
          onSelect={setType}
          defaultButtonText="Interaction type"
          buttonTextAfterSelection={capitalize}
          rowTextForSelection={capitalize}
        />
        {defined(onInteractionRemove) && (
          <Button
            confirm={"This action cannot be undone"}
            onPress={onInteractionRemove}
            variant="stealth"
          >
            <Fi name="trash" color="#800" />
          </Button>
        )}
      </View>
      <TextField
        label="Name"
        value={name}
        onChangeText={setName}
        onBlur={() => onInteractionChange({ name })}
      />
      <TimePicker
        label="Show"
        value={start ?? 0}
        onChange={handleStartChange}
      />
      <TimePicker label="Hide" value={end ?? 0} onChange={handleEndChange} />

      {/* Narrowing Fields */}
      {type === "hero" && (
        <HeroEditor
          interaction={interaction as HeroInteraction}
          onInteractionChange={onInteractionChange}
        />
      )}
      {type === "next" && (
        <NextChapterEditor
          interaction={interaction as NextChapterInteraction}
          onInteractionChange={onInteractionChange}
        />
      )}
      {type === "image" && (
        <ImageEditor
          interaction={interaction as ImageInteraction}
          onInteractionChange={onInteractionChange}
        />
      )}
    </View>
  );
}

function HeroEditor({
  interaction,
  onInteractionChange,
}: EditorProps<HeroInteraction>) {
  const [text, setText] = useState(interaction?.text ?? "");

  return (
    <>
      <TextField
        label="Text"
        value={text}
        onChangeText={setText}
        onBlur={() => onInteractionChange({ text })}
      />
    </>
  );
}

function NextChapterEditor({
  interaction,
  onInteractionChange,
}: EditorProps<NextChapterInteraction>) {
  const [buttonText, setButtonText] = useState(interaction?.text ?? ""); // todo: change this interaction to use `buttonText` instead of `text`

  return (
    <>
      <TextField
        label="Button text"
        value={buttonText}
        onChangeText={setButtonText}
        onBlur={() => onInteractionChange({ text: buttonText })}
      />
    </>
  );
}

function ImageEditor({
  interaction,
  onInteractionChange,
}: EditorProps<ImageInteraction>) {
  const [url, setUrl] = useState(interaction?.imageUrl ?? "");
  const [caption, setCaption] = useState(interaction?.caption ?? "");

  return (
    <>
      {/* image picker... not text field */}
      <TextField
        label="Url"
        value={url}
        onChangeText={setUrl}
        onBlur={() => onInteractionChange({ imageUrl: url })}
      />
      <TextField
        label="Caption"
        value={caption}
        onChangeText={setCaption}
        onBlur={() => onInteractionChange({ caption })}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  heading: { fontSize: 24, fontWeight: "bold" },
  heading2: { fontSize: 18, fontWeight: "bold" },
  fileZone: {
    backgroundColor: "#ddd",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  pill: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: "#444",
    color: "#444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  interactionList: { padding: 8, gap: 16 },
  interactionTimeline: { position: "relative" },
  interaction: {},
  interactionInfo: {
    flexDirection: "row",
    gap: 8,
  },
  interactionNode: {
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#2196F3",
    overflow: "hidden",
    borderRadius: 8,
  },
  interactionCursor: {
    position: "absolute",
    left: 0,
    height: "100%",
    width: 1,
    backgroundColor: "#000",
  },
  interactionNodeText: {
    color: "#fff",
    padding: 8,
  },
  playbackControls: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  timestamp: {
    textAlign: "center",
    fontSize: 12,
  },
  activeInteraction: {
    gap: 8,
  },
  activeInteractionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  createInteraction: {
    gap: 16,
  },
});
