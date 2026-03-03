import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  Image,
  InputGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, PlusCircle, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import HeroCarousel from "./HeroCarousel";
import type { IHeroCarouselItem } from "./HeroCarousel";
import {
  getCarouselItems,
  createCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
} from "../api/mockClient";
import "./CarouselManager.css";

// Interface para el banner del carrusel - alineada con el backend
interface ICarouselItem {
  id: number;
  title: string;
  subtitle: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IFormState {
  title: string;
  subtitle: string;
  link: string;
  order: number;
  isActive: boolean;
  desktopImageFile: File | null;
  desktopImageUrl: string; // URL alternativa
  mobileImageFile: File | null;
  mobileImageUrl: string; // URL alternativa
}

const CarouselManager: React.FC = () => {
  const { token } = useAuth();
  const [carouselItems, setCarouselItems] = useState<ICarouselItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ICarouselItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formState, setFormState] = useState<IFormState>({
    title: "",
    subtitle: "",
    link: "",
    order: 0,
    isActive: false,
    desktopImageFile: null,
    desktopImageUrl: "",
    mobileImageFile: null,
    mobileImageUrl: "",
  });

  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string | null>(
    null,
  );
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string | null>(null);
  // Max allowed file size for uploads (match backend Multer limit)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Fetch carousel items on mount
  useEffect(() => {
    fetchCarouselItems();
  }, [token]);

  // Update preview URLs when files or existing items change
  useEffect(() => {
    if (formState.desktopImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesktopPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(formState.desktopImageFile);
    } else if (formState.desktopImageUrl) {
      // Show preview for pasted URLs
      setDesktopPreviewUrl(formState.desktopImageUrl);
    } else if (editingItem) {
      setDesktopPreviewUrl(editingItem.desktopImageUrl);
    } else {
      setDesktopPreviewUrl(null);
    }
  }, [formState.desktopImageFile, formState.desktopImageUrl, editingItem]);

  useEffect(() => {
    if (formState.mobileImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMobilePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(formState.mobileImageFile);
    } else if (formState.mobileImageUrl) {
      // Show preview for pasted URLs
      setMobilePreviewUrl(formState.mobileImageUrl);
    } else if (editingItem?.mobileImageUrl) {
      setMobilePreviewUrl(editingItem.mobileImageUrl);
    } else {
      setMobilePreviewUrl(null);
    }
  }, [formState.mobileImageFile, formState.mobileImageUrl, editingItem]);

  const fetchCarouselItems = async () => {
    try {
      setLoading(true);
      const data = await getCarouselItems(token || undefined);
      setCarouselItems(data || []);
      setError("");
    } catch (err) {
      setError("Error al cargar los items del carrusel");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormState({
      title: "",
      subtitle: "",
      link: "",
      order: 0,
      isActive: false,
      desktopImageFile: null,
      desktopImageUrl: "",
      mobileImageFile: null,
      mobileImageUrl: "",
    });
    setDesktopPreviewUrl(null);
    setMobilePreviewUrl(null);
    setError("");
  };

  const handleShow = (item?: ICarouselItem) => {
    if (item) {
      setEditingItem(item);
      setFormState({
        title: item.title,
        subtitle: item.subtitle || "",
        link: item.link || "",
        order: item.order,
        isActive: item.isActive,
        desktopImageFile: null,
        desktopImageUrl: item.desktopImageUrl,
        mobileImageFile: null,
        mobileImageUrl: item.mobileImageUrl || "",
      });
      setDesktopPreviewUrl(item.desktopImageUrl);
      setMobilePreviewUrl(item.mobileImageUrl || null);
    } else {
      setEditingItem(null);
      setFormState({
        title: "",
        subtitle: "",
        link: "",
        order: carouselItems.length,
        isActive: false,
        desktopImageFile: null,
        desktopImageUrl: "",
        mobileImageFile: null,
        mobileImageUrl: "",
      });
      setDesktopPreviewUrl(null);
      setMobilePreviewUrl(null);
    }
    setShowModal(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormState((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "order"
            ? parseInt(value, 10)
            : value,
    }));
  };

  const handleFileChange =
    (fieldName: "desktopImageFile" | "mobileImageFile") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        // Validate file size before setting
        if (file.size > MAX_FILE_SIZE) {
          setError("El archivo es demasiado grande. Tamaño máximo: 5 MB.");
          return;
        }

        // Cuando se selecciona un archivo, limpiar la URL correspondiente
        const urlField =
          fieldName === "desktopImageFile"
            ? "desktopImageUrl"
            : "mobileImageUrl";
        setFormState((prev) => ({
          ...prev,
          [fieldName]: file,
          [urlField]: "",
        }));
        setError("");
      }
    };

  // Actualizar handleChange para limpiar archivos cuando se pega una URL
  const handleChangeWithFileClean = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    // Si es un campo de URL, limpiar el archivo correspondiente
    let updateObj: any = {
      [name]:
        type === "checkbox"
          ? checked
          : name === "order"
            ? parseInt(value, 10)
            : value,
    };

    if (name === "desktopImageUrl" && value) {
      updateObj.desktopImageFile = null;
    } else if (name === "mobileImageUrl" && value) {
      updateObj.mobileImageFile = null;
    }

    setFormState((prev) => ({
      ...prev,
      ...updateObj,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formState.title.trim()) {
      setError("El título es requerido");
      return;
    }

    // Validar que se proporcione una imagen (archivo o URL)
    if (
      !editingItem &&
      !formState.desktopImageFile &&
      !formState.desktopImageUrl
    ) {
      setError("Se requiere imagen desktop: sube un archivo o pega una URL");
      return;
    }

    try {
      // Prevent submitting oversized files
      if (
        formState.desktopImageFile &&
        formState.desktopImageFile.size > MAX_FILE_SIZE
      ) {
        setError("La imagen desktop excede el tamaño máximo permitido (5 MB).");
        return;
      }
      if (
        formState.mobileImageFile &&
        formState.mobileImageFile.size > MAX_FILE_SIZE
      ) {
        setError("La imagen mobile excede el tamaño máximo permitido (5 MB).");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("title", formState.title);
      formData.append("subtitle", formState.subtitle);
      formData.append("link", formState.link);
      formData.append("order", formState.order.toString());
      formData.append("isActive", formState.isActive.toString());

      // Agregar archivos si existen
      if (formState.desktopImageFile) {
        formData.append("desktopImage", formState.desktopImageFile);
      } else if (formState.desktopImageUrl) {
        // Si no hay archivo, agregar la URL
        formData.append("desktopImageUrl", formState.desktopImageUrl);
      }

      if (formState.mobileImageFile) {
        formData.append("mobileImage", formState.mobileImageFile);
      } else if (formState.mobileImageUrl) {
        formData.append("mobileImageUrl", formState.mobileImageUrl);
      }

      if (editingItem) {
        await updateCarouselItem(editingItem.id, formData, token || undefined);
        setSuccess("Banner actualizado correctamente");
      } else {
        await createCarouselItem(formData, token || undefined);
        setSuccess("Banner creado correctamente");
      }

      await fetchCarouselItems();
      handleClose();
    } catch (err) {
      setError(
        "Error al guardar el banner: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este banner?"))
      return;

    try {
      setLoading(true);
      await deleteCarouselItem(id, token || undefined);
      setSuccess("Banner eliminado correctamente");
      await fetchCarouselItems();
    } catch (err) {
      setError(
        "Error al eliminar el banner: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeCarouselItems: IHeroCarouselItem[] = carouselItems
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.id.toString(),
      title: item.title,
      subtitle: item.subtitle || "",
      backgroundImage: item.desktopImageUrl,
      trailerLink: item.link || "#",
      infoLink: item.link || "#",
    }));

  return (
    <div className="carousel-manager p-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <div className="mb-5">
        <h2 className="mb-4">Previsualización del Carrusel Activo</h2>
        <HeroCarousel items={activeCarouselItems} />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Cartelera Hero</h2>
        <Button
          variant="primary"
          onClick={() => handleShow()}
          disabled={loading}
        >
          <PlusCircle className="me-2" size={18} /> Añadir Nuevo Banner
        </Button>
      </div>

      {loading && !showModal ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive className="carousel-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Orden</th>
              <th>Imagen Desktop</th>
              <th>Link</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {carouselItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.order}</td>
                <td>
                  <Image
                    src={item.desktopImageUrl}
                    thumbnail
                    style={{
                      width: "100px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{item.link || "-"}</td>
                <td>{item.isActive ? "Sí" : "No"}</td>
                <td>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShow(item)}
                    disabled={loading}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <AnimatePresence>
        {showModal && (
          <Modal show={showModal} onHide={handleClose} centered size="lg">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="modal-content-wrapper"
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {editingItem ? "Editar Banner" : "Añadir Nuevo Banner"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Título *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Introduce el título del banner"
                      name="title"
                      value={formState.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formSubtitle">
                    <Form.Label>Subtítulo</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Introduce el subtítulo"
                      name="subtitle"
                      value={formState.subtitle}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formOrder">
                    <Form.Label>Orden</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Orden de aparición"
                      name="order"
                      value={formState.order}
                      onChange={handleChange}
                      min="0"
                    />
                    <Form.Text className="text-muted">
                      Menor número = mayor prioridad al mostrar
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formLink">
                    <Form.Label>Link de Destino</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: /cartelera/123"
                      name="link"
                      value={formState.link}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formDesktopImage" className="mb-3">
                    <Form.Label>
                      Imagen Desktop
                      {!editingItem && " *"}
                    </Form.Label>
                    <Form.Text className="text-muted d-block mb-2">
                      Opción 1: Sube un archivo
                    </Form.Text>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange("desktopImageFile")}
                      disabled={!!formState.desktopImageUrl}
                    />
                    <Form.Text className="text-muted d-block mt-2 mb-2">
                      Opción 2: Pega una URL de internet
                    </Form.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ej: https://ejemplo.com/imagen.jpg"
                      name="desktopImageUrl"
                      value={formState.desktopImageUrl}
                      onChange={handleChangeWithFileClean}
                      disabled={!!formState.desktopImageFile}
                    />
                    <Form.Text className="text-muted d-block mt-2">
                      Resolución recomendada: 1920x800px
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formMobileImage" className="mb-3">
                    <Form.Label>Imagen Mobile (Opcional)</Form.Label>
                    <Form.Text className="text-muted d-block mb-2">
                      Opción 1: Sube un archivo
                    </Form.Text>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange("mobileImageFile")}
                      disabled={!!formState.mobileImageUrl}
                    />
                    <Form.Text className="text-muted d-block mt-2 mb-2">
                      Opción 2: Pega una URL de internet
                    </Form.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ej: https://ejemplo.com/imagen-mobile.jpg"
                      name="mobileImageUrl"
                      value={formState.mobileImageUrl}
                      onChange={handleChangeWithFileClean}
                      disabled={!!formState.mobileImageFile}
                    />
                    <Form.Text className="text-muted d-block mt-2">
                      Resolución recomendada: 480x600px
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formIsActive">
                    <Form.Check
                      type="checkbox"
                      label="Activo (mostrar en el carrusel)"
                      name="isActive"
                      checked={formState.isActive}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {desktopPreviewUrl && (
                    <div className="real-time-preview mb-4 p-3 border rounded">
                      <h5>Previsualización Desktop:</h5>
                      <Image
                        src={desktopPreviewUrl}
                        fluid
                        className="preview-image rounded"
                        alt="Previsualización desktop"
                      />
                    </div>
                  )}

                  {mobilePreviewUrl && (
                    <div className="real-time-preview mb-4 p-3 border rounded">
                      <h5>Previsualización Mobile:</h5>
                      <Image
                        src={mobilePreviewUrl}
                        fluid
                        className="preview-image rounded"
                        style={{ maxWidth: "300px" }}
                        alt="Previsualización mobile"
                      />
                    </div>
                  )}

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Guardando...
                        </>
                      ) : editingItem ? (
                        "Guardar Cambios"
                      ) : (
                        "Crear Banner"
                      )}
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarouselManager;
