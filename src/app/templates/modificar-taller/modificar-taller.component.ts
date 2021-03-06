import { Component, OnInit, TemplateRef } from '@angular/core';
import { CursoService } from 'src/app/Service/curso.service';
import { UserService } from 'src/app/Service/user.service';
import { Curso } from '../../interface/curso';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { faImages } from '@fortawesome/free-solid-svg-icons'
import {  NuevoCurso } from 'src/app/models/nuevo-curso';
import { ImagenService } from 'src/app/Service/imagen.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UnidadService } from 'src/app/Service/unidad-service.service';
import { TokenService } from 'src/app/Service/token.service';


@Component({
  selector: 'app-modificar-taller',
  templateUrl: './modificar-taller.component.html',
  styleUrls: ['./modificar-taller.component.css']
})
export class ModificarTallerComponent implements OnInit {


  constructor(
    public userService: UserService,
    private route: Router,
    private activeRouter: ActivatedRoute,
    private modalService: BsModalService,
    private cursoService: CursoService,
    private imagenService:ImagenService,
    private spinner: NgxSpinnerService,
    private unidadService:UnidadService,
    private tokenService:TokenService
  ) { }

  datosCurso: Curso;
  faImages = faImages;
  textareaDescripcion: boolean = false;
  textareaSubtitulo: boolean = false;
  textareaPrecio: boolean = false;
  textareaCategoria: boolean = false;
  nombreCapacitador:string;
  imagen : File;
  imagenMin : File;
  taller: Curso;
  nombreTaller: string;
  subtituloTaller: string;
  precioTaller: number;
  descripcionTaller: string;
  categoriaTaller: string;
  idAdministrador: number;

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
 
      let cursoId = this.activeRouter.snapshot.paramMap.get('id');
      this.cursoService.findOne(cursoId).subscribe(
        data =>{     
        this.datosCurso = data
        this.subtituloTaller = this.datosCurso.subtitulo;
        this.precioTaller = this.datosCurso.precio;
        this.descripcionTaller = this.datosCurso.descripcion;
        this.categoriaTaller = this.datosCurso.categoria;
        this.userService.findOne(this.datosCurso.id_usuario_creador).subscribe(response=>{
        this.nombreCapacitador = response.nombre +' '+ response.apellido;
        })      
      })
    } else {
      this.route.navigate(['lista-cursos']);
    }
  }
  irContenido() {
    let cursoId = this.activeRouter.snapshot.paramMap.get('id');
    this.route.navigate(['modificar_taller' ,cursoId, 'modificar-contenido'])
   }
  activarTextareaSubtitulo() {
    if (this.textareaSubtitulo) {
      this.textareaSubtitulo = false;
    } else this.textareaSubtitulo = true;
  }
  activarTextareaDescripcion() {
    if (this.textareaDescripcion) {
      this.textareaDescripcion = false;
    } else this.textareaDescripcion = true;
  }
  activarTextareaCategoria() {
    if (this.textareaCategoria) {
      this.textareaCategoria = false;
    } else this.textareaCategoria = true;
  }
  activarTextareaPrecio() {
    if (this.textareaPrecio) {
      this.textareaPrecio = false;
    } else this.textareaPrecio = true;
  }
  updateSubtitulo(){
    const cursoId = this.activeRouter.snapshot.paramMap.get('id');
    this.cursoService.updateSubtitulo(cursoId, this.subtituloTaller).subscribe(
      data=>{
        window.location.reload();

      }
    )
  }
  updateDescripcion(){
    const cursoId = this.activeRouter.snapshot.paramMap.get('id');
    this.cursoService.updateDescripcion(cursoId, this.descripcionTaller).subscribe(
      data=>{
        window.location.reload();

      }
    )
  }
  updateCategoria(){
    const cursoId = this.activeRouter.snapshot.paramMap.get('id');
    this.cursoService.updateCategoria(cursoId, this.categoriaTaller).subscribe(
      data=>{
        window.location.reload();

      }
    )
  }
  updatePrecio(){
    const cursoId = this.activeRouter.snapshot.paramMap.get('id');
    this.cursoService.updatePrecio(cursoId, this.precioTaller).subscribe(
      data=>{
        window.location.reload();
      }
    )
  }
  onUploadImg(){
    this.spinner.show();
    let cursoId = this.activeRouter.snapshot.paramMap.get('id');
    this.imagenService.upload(this.imagen, cursoId).subscribe(
      data=>{
        this.spinner.hide();
        window.location.reload();
      },
      err => 
      {
        this.spinner.hide();
        alert(err.console.error.mensaje);
        this.reset();
      }
    )
  }
  reset(){
    this.imagen = null;
    this.imagenMin = null;
  }

  createUnidad(){
    var idUnidad:number = + this.datosCurso.id;
    console.log(idUnidad);
    this.unidadService.new(idUnidad).subscribe(
      data=>{
        window.location.reload();
      }
    )
  }

  onFileChange(event){
    this.imagen = event.target.files[0];
    const fr = new FileReader();
    fr.onload = (evento : any) =>{
      this.imagenMin = evento.target.result;
    };
    fr.readAsDataURL(this.imagen);

  }

}